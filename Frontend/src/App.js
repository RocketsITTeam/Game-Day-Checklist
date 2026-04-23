import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

const initialSections = {
  preGame: {
    name: "PRE-GAME SETUP CHECKLIST",
    techName: "(unassigned)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  postGame: {
    name: "POST-GAME CHECKLIST",
    techName: "(unassigned)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  DVOM: {
    name: "D-VOM MEDIA CHECKLIST",
    techName: "(unassigned)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  RefPacks: {
    name: "REFEREE PACKS CHECKLIST",
    techName: "(manager-only section)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  EastClub: {
    name: "EAST CLUB CHECKLIST",
    techName: "(unassigned)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  WestClub: {
    name: "WEST CLUB CHECKLIST",
    techName: "(unassigned)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
  bbOps: {
    name: "BBOps tech checklist",
    techName: "(manager-only section)",
    items: [],
    managerVerified: false,
    verifiedAt: null,
  },
};


function getGameKey(game) {
  if (!game?.date || !game?.opponent) return null;
  return `${game.date}__${game.opponent}`;
}

function getTaskGroups(section) {
  if (Array.isArray(section?.tasks)) return { key: "tasks", list: section.tasks };
  if (Array.isArray(section?.groups)) return { key: "groups", list: section.groups };
  return { key: null, list: [] };
}

function getTaskItems(task) {
  if (Array.isArray(task?.items)) return task.items;
  if (Array.isArray(task?.steps)) return task.steps;
  if (Array.isArray(task?.checklist)) return task.checklist;
  if (Array.isArray(task?.tasks)) return task.tasks;
  return [];
}

function setTaskItems(task, nextItems) {
  if (Array.isArray(task?.items)) return { ...task, items: nextItems };
  if (Array.isArray(task?.steps)) return { ...task, steps: nextItems };
  if (Array.isArray(task?.checklist)) return { ...task, checklist: nextItems };
  if (Array.isArray(task?.tasks)) return { ...task, tasks: nextItems };
  return { ...task, items: nextItems };
}

function mergeProgress(fresh, saved) {
  if (!saved || typeof saved !== "object") return fresh;

  const out = { ...fresh };

  Object.keys(out).forEach((sectionKey) => {
    const sec = out[sectionKey];
    const savedSec = saved[sectionKey];
    if (!sec || !savedSec) return;

    const freshTG = getTaskGroups(sec);
    const savedTG = getTaskGroups(savedSec);

    if (freshTG.list.length && savedTG.list.length) {
      const savedById = new Map(savedTG.list.map((t) => [t.id, t]));

      const nextList = freshTG.list.map((t) => {
        const st = savedById.get(t.id);
        if (!st) return t;

        const freshItems = getTaskItems(t);
        const savedItems = getTaskItems(st);
        const savedItemById = new Map(savedItems.map((i) => [i.id, i]));

        const mergedItems = freshItems.map((i) => {
          const si = savedItemById.get(i.id);
          return si ? { ...i, completed: !!si.completed } : i;
        });

        return setTaskItems(
          {
            ...t,
            assignedTech: st.assignedTech ?? t.assignedTech,
            managerVerified: !!st.managerVerified,
            verifiedAt: st.verifiedAt ?? null,
          },
          mergedItems
        );
      });

      out[sectionKey] = { ...sec, [freshTG.key]: nextList };
      return;
    }

    // section.items format
    const freshItems = Array.isArray(sec.items) ? sec.items : [];
    const savedItems = Array.isArray(savedSec.items) ? savedSec.items : [];
    const savedItemById = new Map(savedItems.map((i) => [i.id, i]));

    const mergedItems = freshItems.map((i) => {
      const si = savedItemById.get(i.id);
      return si ? { ...i, completed: !!si.completed } : i;
    });

    out[sectionKey] = {
      ...sec,
      techName: savedSec.techName ?? sec.techName,
      managerVerified: !!savedSec.managerVerified,
      verifiedAt: savedSec.verifiedAt ?? null,
      items: mergedItems,
    };
  });

  return out;
}

function Section({
  sectionKey,
  section,
  canVerify,
  isAdmin,
  visible,
  onToggleItem,
  onToggleManagerVerified,
  onAdminEdit,
  onAssignTech,
  techOptions,
}) {
  const [open, setOpen] = useState(true);
  if (!visible || !section) return null;

  const { key: taskKey, list: taskGroups } = getTaskGroups(section);
  const hasTasks = taskGroups.length > 0;

  const allItems = hasTasks
    ? taskGroups.flatMap((t) => getTaskItems(t))
    : Array.isArray(section.items)
    ? section.items
    : [];

  const total = allItems.length;
  const completedCount = allItems.filter((i) => i.completed).length;

  const canAssign = isAdmin || canVerify;

  return (
    <div className="section">
      <button
        className="section-header"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <div>
          <div className="section-title">
            {section.name}
            {hasTasks && (
              <span style={{ marginLeft: '16px', fontSize: '0.85rem', fontWeight: 'normal' }}>
                • Assigned: {section.techName || "(unassigned)"}
              </span>
            )}
          </div>
          {!hasTasks && (
            <div className="section-subtitle">
              {section.techName ? `Tech: ${section.techName}` : "Tech: (unassigned)"}
            </div>
          )}
        </div>
        <div className="section-progress">
          {completedCount}/{total} completed
        </div>
      </button>

      {open && (
        <div className="section-body">
          {/* Section-level tech assignment for sections WITH tasks */}
          {hasTasks && canAssign && onAssignTech && (
            <div className="tech-assign" style={{ marginBottom: '16px' }}>
              <label className="assign-tech-label">
                <span className="assign-tech-text">Assigned Tech:</span>
                <select
                  className="assign-tech-select"
                  value={section.techName || "(unassigned)"}
                  onChange={(e) => onAssignTech(sectionKey, e.target.value)}
                >
                  {techOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {!hasTasks && (
            <>
              {canAssign && onAssignTech && (
                <div className="tech-assign">
                  <label className="assign-tech-label">
                    <span className="assign-tech-text">Assigned Tech:</span>
                    <select
                      className="assign-tech-select"
                      value={section.techName || "(unassigned)"}
                      onChange={(e) => onAssignTech(sectionKey, e.target.value)}
                    >
                      {techOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <ul className="checklist">
                {(Array.isArray(section.items) ? section.items : []).map((item) => (
                  <li key={item.id} className="checklist-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!item.completed}
                        onChange={() => onToggleItem(sectionKey, item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="manager-verification">
                {canVerify && (
                  <label>
                    <input
                      type="checkbox"
                      disabled={total === 0 || completedCount !== total}
                      checked={!!section.managerVerified}
                      onChange={() => onToggleManagerVerified(sectionKey)}
                    />
                    <span>
                      Manager verification
                      {!(total > 0 && completedCount === total) &&
                        " (available when all items are completed)"}
                    </span>
                  </label>
                )}

                <div className="manager-timestamp">
                  {section.managerVerified && section.verifiedAt
                    ? `Verified by manager at: ${section.verifiedAt}`
                    : "Awaiting manager verification"}
                </div>

                {isAdmin && onAdminEdit && (
                  <div className="admin-controls">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() => onAdminEdit(sectionKey)}
                    >
                      Edit checklist (admin only)
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {hasTasks && (
            <div className="task-groups">
              {taskGroups.map((task) => {
                const taskItems = getTaskItems(task);
                const taskTotal = taskItems.length;
                const taskCompleted = taskItems.filter((i) => i.completed).length;

                return (
                  <details key={task.id} className="task-group">
                    <summary className="task-group-header">
                      <span className="task-title">{task.title}</span>
                      <span className="task-progress">
                        {taskCompleted}/{taskTotal}
                      </span>
                    </summary>

                    <ul className="checklist">
                      {taskItems.map((item) => (
                        <li key={item.id} className="checklist-item">
                          <label>
                            <input
                              type="checkbox"
                              checked={!!item.completed}
                              onChange={() =>
                                onToggleItem(sectionKey, item.id, task.id)
                              }
                            />
                            <span>{item.label}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          )}

          {hasTasks && (
            <div className="manager-verification">
              {canVerify && (
                <label>
                  <input
                    type="checkbox"
                    disabled={total === 0 || completedCount !== total}
                    checked={!!section.managerVerified}
                    onChange={() => onToggleManagerVerified(sectionKey)}
                  />
                  <span>
                    Manager verification for entire section
                    {!(total > 0 && completedCount === total) &&
                      " (available when all items are completed)"}
                  </span>
                </label>
              )}

              <div className="manager-timestamp">
                {section.managerVerified && section.verifiedAt
                  ? `Verified by manager at: ${section.verifiedAt}`
                  : "Awaiting manager verification"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RoleSelector({ role, onChange }) {
  return (
    <div className="role-selector">
      <span className="role-label">View as:</span>
      <select
        value={role}
        onChange={(e) => onChange(e.target.value)}
        className="role-select"
      >
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
        <option value="TECH">Tech</option>
      </select>
    </div>
  );
}

function App() {
  const [authUser, setAuthUser] = useState(() => {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  });

  const [loginPassword, setLoginPassword] = useState("");
  const [storageAvailable] = useState(isLocalStorageAvailable());
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoginError("");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoginError(data.error || "Login failed");
      return;
    }

    const user = { authRole: data.authRole };
    setAuthUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));

    // default view role = their real role
    setRole(data.authRole);

    setLoginPassword("");
  } catch (err) {
    console.error(err);
    setLoginError("Login failed");
  }
};


  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("authUser");
  };

  const [role, setRole] = useState("MANAGER");
  const [techUser, setTechUser] = useState(() => {
    return localStorage.getItem("techUser") || "";
  });
  useEffect(() => {
    if (!authUser) return;

    if (authUser.authRole === "TECH") {
      setRole("TECH");
    }
  }, [authUser]);
  
  useEffect(() => {
    localStorage.setItem("techUser", techUser);
  }, [techUser]);

  const [sections, setSections] = useState(initialSections);

  const [currentGame, setCurrentGame] = useState(null);
  const [gameError, setGameError] = useState(null);
  const [checklistsError, setChecklistsError] = useState(null);

  const [checklistsLoaded, setChecklistsLoaded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [adminEditorOpen, setAdminEditorOpen] = useState(false);
  const [adminRawJson, setAdminRawJson] = useState("");
  const [adminSaveStatus, setAdminSaveStatus] = useState("");
  const [activeTab, setActiveTab] = useState("full-setup"); 

  const openAdminEditor = () => {
  setAdminRawJson(JSON.stringify(sections, null, 2));
  setAdminSaveStatus("");
  setAdminEditorOpen(true);
};

const saveAdminEditor = async () => {
  setAdminSaveStatus("");
    let parsed;
    try {
      parsed = JSON.parse(adminRawJson);
    } catch {
      setAdminSaveStatus("Invalid JSON (fix formatting)");
      return;
    }

    // Prompt so you DON'T store the admin password in the frontend
    const adminPass = window.prompt("Enter ADMIN password to save changes:");
    if (!adminPass) return;

    try {
      const res = await fetch(`${API_BASE_URL}/checklists/${activeTab}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPass,
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        setAdminSaveStatus(data.error || "Save failed");
        return;
      }

      // Update UI with the saved JSON
      setSections(parsed);
      setAdminSaveStatus("Saved ✅");
      setAdminEditorOpen(false);
    } catch (err) {
      console.error(err);
      setAdminSaveStatus("Save failed");
  }
};
  const [techOptions, setTechOptions] = useState(["(unassigned)"]);
  useEffect(() => {
    async function loadTechs() {
      try {
        const res = await fetch(`${API_BASE_URL}/techs`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (Array.isArray(data.techOptions)) setTechOptions(data.techOptions);
      } catch (e) {
        console.error("Failed to load techs, using fallback.");
      }
    }
    loadTechs();
  }, []);

  useEffect(() => {
    async function loadChecklists() {
      try {
        const res = await fetch(`${API_BASE_URL}/checklists/${activeTab}`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setSections(data);
        setChecklistsError(null);
      } catch (err) {
        console.error("Error fetching checklists:", err);
        setChecklistsError("Unable to load checklists from server. Using backup.");
        setSections(initialSections);
      } finally {
        setChecklistsLoaded(true);
      }
    }
    loadChecklists();
  }, [activeTab]);

  useEffect(() => {
    async function loadCurrentGame() {
      try {
        const res = await fetch(`${API_BASE_URL}/current-game`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setCurrentGame(data);
        setGameError(null);
      } catch (err) {
        console.error("Error fetching current game:", err);
        setGameError("Could not load current game from server.");
      }
    }
    loadCurrentGame();
  }, []);

  useEffect(() => {
    if (!currentGame) return;
    if (!checklistsLoaded) return;

    const key = getGameKey(currentGame);
    if (!key) return;

    const stored = localStorage.getItem(`sections_${key}_${activeTab}`);
    if (stored) {
      try {
        const saved = JSON.parse(stored);
        setSections((prev) => mergeProgress(prev, saved));
      } catch (e) {
        console.error("Bad saved sections JSON, ignoring.");
      }
    }
    setHydrated(true);
  }, [currentGame, checklistsLoaded, activeTab]);

  useEffect(() => {
    if (!currentGame) return;
    if (!hydrated) return;

    const key = getGameKey(currentGame);
    if (!key) return;

    localStorage.setItem(`sections_${key}_${activeTab}`, JSON.stringify(sections));
  }, [sections, currentGame, hydrated, activeTab]);

  const handleToggleItem = (sectionKey, itemId, taskId = null) => {
    setSections((prev) => {
      const section = prev?.[sectionKey];
      if (!section) return prev;

      const { key: taskKey, list: taskGroups } = getTaskGroups(section);

      if (taskId && taskKey) {
        const nextGroups = taskGroups.map((t) => {
          if (t.id !== taskId) return t;

          const curItems = getTaskItems(t);
          const nextItems = curItems.map((it) =>
            it.id === itemId ? { ...it, completed: !it.completed } : it
          );

          const anyIncomplete = nextItems.some((i) => !i.completed);

          const nextTask = setTaskItems(
            {
              ...t,
              managerVerified: anyIncomplete ? false : !!t.managerVerified,
              verifiedAt: anyIncomplete ? null : t.verifiedAt,
            },
            nextItems
          );

          return nextTask;
        });

        return { ...prev, [sectionKey]: { ...section, [taskKey]: nextGroups } };
      }

      const items = (Array.isArray(section.items) ? section.items : []).map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      const anyIncomplete = items.some((i) => !i.completed);

      return {
        ...prev,
        [sectionKey]: {
          ...section,
          items,
          managerVerified: anyIncomplete ? false : !!section.managerVerified,
          verifiedAt: anyIncomplete ? null : section.verifiedAt,
        },
      };
    });
  };

  const handleToggleManagerVerified = (sectionKey, taskId = null) => {
    setSections((prev) => {
      const section = prev?.[sectionKey];
      if (!section) return prev;

      const formatted = new Date().toLocaleString();
      const { key: taskKey, list: taskGroups } = getTaskGroups(section);

      if (taskId && taskKey) {
        const nextGroups = taskGroups.map((t) => {
          if (t.id !== taskId) return t;
          const nextVerified = !t.managerVerified;
          return {
            ...t,
            managerVerified: nextVerified,
            verifiedAt: nextVerified ? formatted : null,
          };
        });

        return { ...prev, [sectionKey]: { ...section, [taskKey]: nextGroups } };
      }
      
      const nextVerified = !section.managerVerified;

      return {
        ...prev,
        [sectionKey]: {
          ...section,
          managerVerified: nextVerified,
          verifiedAt: nextVerified ? formatted : null,
        },
      };
    });
  };

  const handleAssignTech = (sectionKey, techName, taskId = null) => {
    setSections((prev) => {
      const section = prev?.[sectionKey];
      if (!section) return prev;

      const displayName =
        techName === "(unassigned)" || techName.trim() === ""
          ? "(unassigned)"
          : techName;

      const { key: taskKey, list: taskGroups } = getTaskGroups(section);

      if (taskId && taskKey) {
        const nextGroups = taskGroups.map((t) =>
          t.id === taskId ? { ...t, assignedTech: displayName } : t
        );
        return { ...prev, [sectionKey]: { ...section, [taskKey]: nextGroups } };
      }

      return {
        ...prev,
        [sectionKey]: { ...section, techName: displayName },
      };
    });
  };

  const handleAdminEdit = (sectionKey) => {
    const sectionName = sections?.[sectionKey]?.name || sectionKey;
    alert(`Admin edit mode for: ${sectionName} (to be implemented later).`);
  };

  const effectiveRole =
  authUser?.authRole === "TECH" ? "TECH" : role;
  const isAdmin = effectiveRole === "ADMIN";
  const canVerify = effectiveRole === "MANAGER" || effectiveRole === "ADMIN";
  const showBbOps = role !== "TECH";

function sectionIsVisibleForRole(sectionKey, sectionObj) {
  // Admin sees everything
  if (isAdmin) return true;

  // Manager sees everything (you can tighten later if needed)
  if (role === "MANAGER") return true;

  // Tech: must pick their name first
  if (role === "TECH") {
    if (!techUser) return false;

    // Hide manager-only sections
    const techNameText = (sectionObj?.techName || "").toLowerCase();
    if (techNameText.includes("manager-only")) return false;

    // Show if section-level assigned
    if (sectionObj?.techName === techUser) return true;

    // Show if ANY task in this section is assigned to this tech
    const taskGroups = Array.isArray(sectionObj?.tasks)
      ? sectionObj.tasks
      : Array.isArray(sectionObj?.groups)
      ? sectionObj.groups
      : [];

    return taskGroups.some((t) => t?.assignedTech === techUser);
  }

  return true;
}


  if (!authUser) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Rockets Game Day Checklist</h1>
          <form onSubmit={handleLoginSubmit} className="login-form">
            <label className="login-label">
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="login-input"
              />
            </label>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {authUser?.authRole !== "TECH" && (
        <RoleSelector role={role} onChange={setRole} />
      )}
      {isAdmin && (
        <div style={{ margin: "10px 0" }}>
          <button type="button" onClick={openAdminEditor}>
            Edit Checklist JSON (Admin)
          </button>
        </div>
      )}

      {gameError && <div className="error-banner">{gameError}</div>}
      {!storageAvailable && (
        <div className="error-banner">
          Your browser is blocking data storage. Progress will not be saved. Please enable cookies/storage in Safari Settings - Privacy, or use Chrome.
        </div>
      )}
      {checklistsError && <div className="error-banner">{checklistsError}</div>}
      
      <header className="app-header">
        <div className="header-top-row">
          <div className="header-title">{currentGame ? currentGame.opponent : "TBD"}</div>
        </div>

        <div className="game-meta">
          <span>{currentGame ? currentGame.date : "--"}</span> •{" "}
          <span>{currentGame ? currentGame.time : "--"}</span>
        </div>

        <div className="game-manager">
          Assigned Manager: {currentGame ? currentGame.managerName : "TBD"}
        </div>
        {isAdmin && adminEditorOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 9999,
            }}
          >
            <div style={{ background: "#fff", width: "95%", maxWidth: 900, padding: 16 }}>
              <h2>Admin Checklist JSON Editor</h2>

              <textarea
                value={adminRawJson}
                onChange={(e) => setAdminRawJson(e.target.value)}
                style={{ width: "100%", height: 450, fontFamily: "monospace" }}
              />

              {adminSaveStatus && (
                <div style={{ marginTop: 8 }}>{adminSaveStatus}</div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="button" onClick={saveAdminEditor}>
                  Save to Server
                </button>
                <button type="button" onClick={() => setAdminEditorOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </header>

      <div className="tabs">
        <button
          className={activeTab === "full-setup" ? "tab active" : "tab"}
          onClick={() => setActiveTab("full-setup")}
        >
          Full Setup
        </button>
        <button
          className={activeTab === "partial-setup" ? "tab active" : "tab"}
          onClick={() => setActiveTab("partial-setup")}
        >
          Partial Setup
        </button>
        <button
          className={activeTab === "full-breakdown" ? "tab active" : "tab"}
          onClick={() => setActiveTab("full-breakdown")}
        >
          Full Breakdown
        </button>
        <button
          className={activeTab === "partial-breakdown" ? "tab active" : "tab"}
          onClick={() => setActiveTab("partial-breakdown")}
        >
          Partial Breakdown
        </button>
      </div>

      <main>
        <Section
          sectionKey="preGame"
          section={sections?.preGame ?? initialSections.preGame}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={activeTab === "full-setup" || activeTab === "partial-setup" || activeTab === "full-breakdown" || activeTab === "partial-breakdown"}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions}
        />
        <Section
          sectionKey="DVOM"
          section={sections?.DVOM ?? initialSections.DVOM}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={activeTab === "full-setup" || activeTab === "partial-setup" || activeTab === "full-breakdown"}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions} 
        />

        <Section
          sectionKey="RefPacks"
          section={sections?.RefPacks ?? initialSections.RefPacks}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={activeTab === "full-setup" || activeTab === "partial-setup" || activeTab === "full-breakdown" || activeTab === "partial-breakdown"}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions} 
        />

        <Section
          sectionKey="EastClub"
          section={sections?.EastClub ?? initialSections.EastClub}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={activeTab === "full-setup" || activeTab === "partial-setup" || activeTab === "full-breakdown" || activeTab === "partial-breakdown"}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions} 
        />

        <Section
          sectionKey="WestClub"
          section={sections?.WestClub ?? initialSections.WestClub}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={activeTab === "full-setup" || activeTab === "partial-setup" || activeTab === "full-breakdown" || activeTab === "partial-breakdown"}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions} 
        />

        <Section
          sectionKey="bbOps"
          section={sections?.bbOps ?? initialSections.bbOps}
          canVerify={canVerify}
          isAdmin={isAdmin}
          visible={showBbOps}
          onToggleItem={handleToggleItem}
          onToggleManagerVerified={handleToggleManagerVerified}
          onAdminEdit={isAdmin ? handleAdminEdit : undefined}
          onAssignTech={handleAssignTech}
          techOptions={techOptions} 
        />
      </main>

      <div className="logout-bottom-container">
        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default App;
