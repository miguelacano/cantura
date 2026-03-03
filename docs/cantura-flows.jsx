import { useState } from "react";

const flows = {
  onboarding: {
    label: "Teacher Onboarding & Studio Setup",
    color: "#2D6A4F",
    accent: "#52B788",
    steps: [
      {
        id: "invite",
        title: "Receive Invite / Sign Up",
        description: "Teacher receives email invite from Admin or self-registers (if open signup enabled).",
        notes: "Admin creates the teacher account in MVP. Self-signup is a post-MVP option.",
        decision: null,
      },
      {
        id: "password",
        title: "Set Password & Verify Email",
        description: "Standard credential setup. Email verification before studio access.",
        notes: null,
        decision: null,
      },
      {
        id: "profile",
        title: "Complete Teacher Profile",
        description: "Name, bio, instruments taught. This seeds the studio identity.",
        notes: "Keep it short — 3 fields max at this step. Don't overwhelm on first login.",
        decision: null,
      },
      {
        id: "studio-setup",
        title: "Studio Setup",
        description: "Name your studio. Optionally add a location or description.",
        notes: "This becomes the workspace root. Think of it like naming a Slack workspace.",
        decision: null,
      },
      {
        id: "import",
        title: "Import or Add Students",
        description: "Choose how to populate your studio roster.",
        notes: null,
        decision: {
          question: "How would you like to add students?",
          branches: [
            {
              label: "📄 Import CSV / Excel",
              detail: "Upload roster file → map columns (name, email, instrument, guardian email) → preview → confirm import → students created + invites queued",
              tag: "Bulk",
            },
            {
              label: "✏️ Add Manually",
              detail: "Enter student name + instrument → optionally add guardian email → save → repeat. Best for small studios or single additions.",
              tag: "One-by-one",
            },
            {
              label: "⏭️ Skip for Now",
              detail: "Land on empty teacher dashboard with persistent 'Add your first student' prompt. Can import later via Settings.",
              tag: "Defer",
            },
          ],
        },
      },
      {
        id: "done",
        title: "Land on Teacher Dashboard",
        description: "Studio is live. Dashboard shows today's context: upcoming students, recent notes, empty states with helpful prompts.",
        notes: "First-run empty states are critical UX here — they should guide, not intimidate.",
        decision: null,
      },
    ],
  },
  dashboards: {
    label: "Home Screens by Role",
    color: "#1D3557",
    accent: "#457B9D",
    steps: [
      {
        id: "teacher-home",
        title: "🎓 Teacher Dashboard",
        description: "Time-oriented view: what happened yesterday, what's coming today.",
        notes: null,
        decision: {
          question: "Key sections on Teacher Home",
          branches: [
            {
              label: "📅 Today's Lessons",
              detail: "List of students with lessons today (if calendar is integrated post-MVP). In MVP: manually surfaced based on recent activity or teacher's pinned students.",
              tag: "Primary",
            },
            {
              label: "📝 Recent Notes",
              detail: "Last 3–5 notes written across all students. Quick-access to continue or follow up. Shows student name + instrument + note snippet.",
              tag: "Primary",
            },
            {
              label: "🔔 Student Activity",
              detail: "Guardian or student replies since last visit. Surfaces the 'unread since last seen' pattern from your UserStudentLastSeen model.",
              tag: "Secondary",
            },
            {
              label: "👥 My Students",
              detail: "Full roster with instrument tags. Click → Student Hub. Filterable by instrument in post-MVP.",
              tag: "Always visible",
            },
          ],
        },
      },
      {
        id: "admin-home",
        title: "🛠️ Admin Dashboard",
        description: "Operational view. Less about daily teaching, more about system health and user management.",
        notes: "Admin rarely needs to see lesson notes. Their world is users, instruments, and access.",
        decision: {
          question: "Key sections on Admin Home",
          branches: [
            {
              label: "👤 User Management",
              detail: "List all teachers, guardians, students. Create/invite users. Disable accounts. Primary admin action.",
              tag: "Primary",
            },
            {
              label: "🎻 Instrument Catalog",
              detail: "Add/edit/remove instruments. These gate what teachers can be assigned and what instrument lanes exist.",
              tag: "Primary",
            },
            {
              label: "📊 Studio Overview (optional)",
              detail: "How many active students, teachers, recent invites pending. Good for a studio director to have at a glance.",
              tag: "Nice to have",
            },
          ],
        },
      },
      {
        id: "guardian-home",
        title: "👨‍👩‍👧 Guardian Dashboard",
        description: "Parent/adult view. May have multiple children enrolled. Focus on participation, not management.",
        notes: "Suzuki insight: guardians attend lessons and are expected to support practice at home. They need to see notes AND be able to add their own observations.",
        decision: {
          question: "Key sections on Guardian Home",
          branches: [
            {
              label: "👧 My Students",
              detail: "Cards for each child. Tap → Student view scoped to that child. Shows instrument, teacher name, last activity.",
              tag: "Primary",
            },
            {
              label: "📝 Recent Notes & Replies",
              detail: "Feed of recent notes across all their children. Shows unread indicators. Guardian can reply directly from feed.",
              tag: "Primary",
            },
            {
              label: "📚 Current Assignments",
              detail: "What each child is working on right now. Piece title, instrument, assigned date. Read-only.",
              tag: "Secondary",
            },
          ],
        },
      },
      {
        id: "student-home",
        title: "🎵 Student Dashboard",
        description: "Simplified, focused view. One student = one experience (in MVP). May have multiple teachers/instruments.",
        notes: "Students don't manage anything — they consume and participate. Keep it clean.",
        decision: {
          question: "Key sections on Student Home",
          branches: [
            {
              label: "🎼 My Assignments",
              detail: "What I'm working on, organized by instrument. Each assignment shows piece/exercise title + any notes from teacher.",
              tag: "Primary",
            },
            {
              label: "📝 Notes & Messages",
              detail: "Notes from teachers. Student can reply (single depth). Simple chronological feed.",
              tag: "Primary",
            },
            {
              label: "🎸 My Teachers",
              detail: "Who teaches me, for which instrument. Contact info if shared. In post-MVP: link to schedule.",
              tag: "Secondary",
            },
          ],
        },
      },
    ],
  },
  repertoire: {
    label: "Repertoire Discovery & Assignment",
    color: "#6B2737",
    accent: "#C77DFF",
    steps: [
      {
        id: "search",
        title: "Teacher Searches for a Piece",
        description: "Teacher enters title, composer, or collection name in search bar.",
        notes: "Search hits 3rd party APIs (OpenOpus for classical, MusicBrainz, etc.) + your local DB simultaneously.",
        decision: null,
      },
      {
        id: "results",
        title: "View Search Results",
        description: "Results shown from external sources + any already in your local catalog.",
        notes: "Disambiguate clearly: 'Already in catalog' vs 'From external source'.",
        decision: {
          question: "What did the teacher find?",
          branches: [
            {
              label: "✅ Found it (external)",
              detail: "Select result → saved as RepertoireItem in DB → added to TeacherLibraryItem → ready to assign.",
              tag: "Happy path",
            },
            {
              label: "✅ Found it (already in catalog)",
              detail: "One click to add to teacher's library if not already there. Skip the save step.",
              tag: "Happy path",
            },
            {
              label: "❌ Not found",
              detail: "Surface 'Add manually' escape hatch inline — don't make teacher navigate away.",
              tag: "Edge case",
            },
          ],
        },
      },
      {
        id: "manual",
        title: "Manual Entry (if needed)",
        description: "Teacher enters: title, composer (optional), collection/method book (optional), notes. Creates a RepertoireItem flagged as teacher-created.",
        notes: "Critical for Suzuki exercises, original arrangements, or obscure method book pieces.",
        decision: null,
      },
      {
        id: "assign",
        title: "Assign to Student",
        description: "From Teacher Library → select student → select instrument lane → confirm. Creates StudentAssignment.",
        notes: "Duplicate assignment to same instrument lane is blocked by your unique constraint. Show a clear error if teacher tries.",
        decision: null,
      },
    ],
  },
};

const tagColors = {
  "Primary": "bg-emerald-100 text-emerald-800",
  "Secondary": "bg-blue-100 text-blue-800",
  "Always visible": "bg-purple-100 text-purple-800",
  "Happy path": "bg-green-100 text-green-800",
  "Edge case": "bg-amber-100 text-amber-800",
  "Bulk": "bg-indigo-100 text-indigo-800",
  "One-by-one": "bg-sky-100 text-sky-800",
  "Defer": "bg-gray-100 text-gray-700",
  "Nice to have": "bg-rose-100 text-rose-800",
};

function DecisionBranches({ decision }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="mt-3 border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{decision.question}</p>
      <div className="flex flex-col gap-2">
        {decision.branches.map((b, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-400 transition-all text-sm font-medium text-gray-800"
            >
              <span>{b.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[b.tag] || "bg-gray-100 text-gray-600"}`}>{b.tag}</span>
                <span className="text-gray-400">{open === i ? "▲" : "▼"}</span>
              </div>
            </button>
            {open === i && (
              <div className="mt-1 ml-3 px-3 py-2 bg-white border-l-2 border-gray-300 text-sm text-gray-600 rounded-r-lg">
                {b.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index, accent }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: accent }}
        >
          {index + 1}
        </div>
        <div className="w-0.5 bg-gray-200 flex-1 mt-2" />
      </div>
      <div className="pb-6 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
        <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
        {step.notes && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-2">
            💡 {step.notes}
          </p>
        )}
        {step.decision && <DecisionBranches decision={step.decision} />}
      </div>
    </div>
  );
}

export default function CanturaFlows() {
  const [activeFlow, setActiveFlow] = useState("onboarding");
  const flow = flows[activeFlow];

  return (
    <div style={{ fontFamily: "'Georgia', serif" }} className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-stone-900 text-white px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎼</span>
            <span className="text-xs tracking-widest uppercase text-stone-400 font-sans">Cantura</span>
          </div>
          <h1 className="text-xl font-bold">UX Flow Reference</h1>
          <p className="text-stone-400 text-sm mt-1 font-sans">Interactive architecture for key user journeys</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-stone-200 px-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex gap-1 overflow-x-auto">
          {Object.entries(flows).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setActiveFlow(key)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all font-sans ${
                activeFlow === key
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flow Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div
          className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white mb-6 font-sans"
          style={{ backgroundColor: flow.color }}
        >
          {flow.label}
        </div>

        <div>
          {flow.steps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} accent={flow.accent} />
          ))}
        </div>

        {/* Design Notes Footer */}
        <div className="mt-4 bg-stone-100 rounded-xl p-4 border border-stone-200">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-1">Architect's Note</p>
          {activeFlow === "onboarding" && (
            <p className="text-sm text-stone-600 font-sans">The CSV/Excel import path is high-value for teachers with existing rosters in spreadsheets. Column mapping UI is the trickiest part — prioritize a forgiving parser that handles messy headers. Guardian email in the import should queue invites, not block the import if missing.</p>
          )}
          {activeFlow === "dashboards" && (
            <p className="text-sm text-stone-600 font-sans">The Suzuki guardian role is a key differentiator here. Guardians attend lessons and practice with their children daily — they're not passive observers. Their dashboard should feel participatory, not read-only. Consider surfacing a "Add a practice note" CTA prominently.</p>
          )}
          {activeFlow === "repertoire" && (
            <p className="text-sm text-stone-600 font-sans">OpenOpus has a free REST API with good classical coverage. MusicBrainz is broader but noisier. For Suzuki specifically, method book pieces (Suzuki Violin Vol. 1, etc.) are likely not in any API — manual entry with a "Method Book" category tag would go a long way for your wife's use case.</p>
          )}
        </div>
      </div>
    </div>
  );
}
