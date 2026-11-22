import { useState } from "react";
import {
  PHASES,
  FEATURES,
  getFeaturesByPhase,
  getPhaseProgress,
  getTotalProgress,
  getTotalEstimatedHours,
  getRemainingHours,
  CATEGORY_LABELS,
  type Feature,
} from "../lib/featureRoadmap";
import { IconCheck, IconClock, IconZap, IconTarget, IconTrendingUp } from "./icons";

export default function FeatureRoadmap() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"timeline" | "board">("timeline");

  const totalProgress = getTotalProgress();
  const totalHours = getTotalEstimatedHours();
  const remainingHours = getRemainingHours();

  return (
    <div className="flex h-full flex-col bg-navy-950">
      {/* Header */}
      <div className="border-b-2 border-maize-400/30 bg-navy-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-wider text-maize-400">
              FEATURE ROADMAP
            </h2>
            <p className="mt-1 text-sm text-chalk/70">
              12 phases · {FEATURES.length} features · {totalHours}h estimated
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("timeline")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-maize-400 text-navy-950"
                  : "bg-navy-800 text-chalk hover:bg-navy-700"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "board"
                  ? "bg-maize-400 text-navy-950"
                  : "bg-navy-800 text-chalk hover:bg-navy-700"
              }`}
            >
              Board
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="rounded-lg border border-maize-400/20 bg-navy-800/50 p-3">
            <div className="flex items-center gap-2 text-xs text-chalk/60">
              <IconTarget className="h-4 w-4" />
              Total Progress
            </div>
            <div className="mt-1 text-2xl font-bold text-maize-400">{totalProgress}%</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-700">
              <div
                className="h-full bg-maize-400 transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg border border-maize-400/20 bg-navy-800/50 p-3">
            <div className="flex items-center gap-2 text-xs text-chalk/60">
              <IconClock className="h-4 w-4" />
              Estimated Total
            </div>
            <div className="mt-1 text-2xl font-bold text-chalk">{totalHours}h</div>
            <div className="mt-1 text-xs text-chalk/50">{Math.ceil(totalHours / 40)} weeks</div>
          </div>
          <div className="rounded-lg border border-maize-400/20 bg-navy-800/50 p-3">
            <div className="flex items-center gap-2 text-xs text-chalk/60">
              <IconZap className="h-4 w-4" />
              Remaining
            </div>
            <div className="mt-1 text-2xl font-bold text-chalk">{remainingHours}h</div>
            <div className="mt-1 text-xs text-chalk/50">{FEATURES.filter((f) => f.status !== "complete").length} features</div>
          </div>
          <div className="rounded-lg border border-maize-400/20 bg-navy-800/50 p-3">
            <div className="flex items-center gap-2 text-xs text-chalk/60">
              <IconTrendingUp className="h-4 w-4" />
              Current Phase
            </div>
            <div className="mt-1 text-2xl font-bold text-maize-400">Phase {selectedPhase}</div>
            <div className="mt-1 text-xs text-chalk/50">{PHASES[selectedPhase - 1].name}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Phase Selector */}
        <div className="w-64 overflow-y-auto border-r border-maize-400/20 bg-navy-900/30 p-3">
          {PHASES.map((phase) => {
            const progress = getPhaseProgress(phase.id);
            const features = getFeaturesByPhase(phase.id);
            const isActive = selectedPhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`mb-2 w-full rounded-lg border-2 p-3 text-left transition-all ${
                  isActive
                    ? "border-maize-400 bg-maize-400/10"
                    : "border-maize-400/20 bg-navy-800/50 hover:border-maize-400/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-maize-400">Phase {phase.id}</span>
                  <span className="text-xs text-chalk/60">{phase.timeline}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-chalk">{phase.name}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-700">
                  <div
                    className="h-full bg-maize-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-chalk/50">
                  {features.length} features · {progress}% complete
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "timeline" ? (
            <TimelineView phaseId={selectedPhase} />
          ) : (
            <BoardView phaseId={selectedPhase} />
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineView({ phaseId }: { phaseId: number }) {
  const phase = PHASES.find((p) => p.id === phaseId);
  const features = getFeaturesByPhase(phaseId);

  if (!phase) return null;

  return (
    <div>
      {/* Phase Header */}
      <div className="mb-6 rounded-lg border-2 border-maize-400/30 bg-navy-800/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-maize-400">{phase.name}</h3>
            <p className="mt-1 text-sm text-chalk/70">{phase.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-maize-400">{getPhaseProgress(phaseId)}%</div>
            <div className="text-xs text-chalk/60">{phase.timeline}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-navy-900/50 p-3">
          <div className="text-xs font-semibold text-chalk/60">GOAL</div>
          <div className="mt-1 text-sm text-chalk">{phase.goal}</div>
        </div>
      </div>

      {/* Features Timeline */}
      <div className="space-y-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
}

function BoardView({ phaseId }: { phaseId: number }) {
  const features = getFeaturesByPhase(phaseId);

  const columns = [
    { status: "planned" as const, label: "Planned", color: "bg-chalk/20" },
    { status: "in-progress" as const, label: "In Progress", color: "bg-maize-400/20" },
    { status: "complete" as const, label: "Complete", color: "bg-inkgreen/20" },
    { status: "deferred" as const, label: "Deferred", color: "bg-chalk/10" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {columns.map((column) => {
        const columnFeatures = features.filter((f) => f.status === column.status);

        return (
          <div key={column.status} className="flex flex-col">
            <div className={`mb-3 rounded-lg ${column.color} p-2`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-chalk">{column.label}</span>
                <span className="rounded-full bg-navy-900 px-2 py-0.5 text-xs text-chalk/60">
                  {columnFeatures.length}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {columnFeatures.map((feature) => (
                <MiniFeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    critical: "bg-inkred text-chalk",
    high: "bg-maize-400 text-navy-950",
    medium: "bg-navy-700 text-chalk",
    low: "bg-navy-800 text-chalk/70",
  };

  const effortLabels = {
    xs: "Extra Small",
    sm: "Small",
    md: "Medium",
    lg: "Large",
    xl: "Extra Large",
  };

  const impactLabels = {
    low: "Low Impact",
    medium: "Medium Impact",
    high: "High Impact",
    critical: "Critical Impact",
  };

  return (
    <div className="rounded-lg border-2 border-maize-400/20 bg-navy-800/50 p-4 transition-all hover:border-maize-400/40">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-chalk/50">#{index + 1}</span>
            <h4 className="text-lg font-bold text-chalk">{feature.name}</h4>
            {feature.status === "complete" && (
              <IconCheck className="h-5 w-5 text-inkgreen" />
            )}
          </div>
          <p className="mt-1 text-sm text-chalk/70">{feature.description}</p>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${priorityColors[feature.priority]}`}>
            {feature.priority.toUpperCase()}
          </span>
          <span className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/70">
            {feature.estimatedHours}h
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/70">
          {CATEGORY_LABELS[feature.category]}
        </span>
        <span className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/70">
          {effortLabels[feature.effort]}
        </span>
        <span className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/70">
          {impactLabels[feature.impact]}
        </span>
        {feature.tags.map((tag) => (
          <span key={tag} className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/60">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-maize-400 hover:text-maize-300"
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-maize-400/20 pt-3">
          {feature.dependencies.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-chalk/60">DEPENDENCIES</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {feature.dependencies.map((dep) => (
                  <span key={dep} className="rounded bg-navy-700 px-2 py-0.5 text-xs text-chalk/70">
                    {FEATURES.find((f) => f.id === dep)?.name || dep}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-chalk/60">STATUS</div>
            <div className="mt-1 text-sm text-chalk capitalize">{feature.status}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniFeatureCard({ feature }: { feature: Feature }) {
  const priorityColors = {
    critical: "border-inkred",
    high: "border-maize-400",
    medium: "border-navy-600",
    low: "border-navy-700",
  };

  return (
    <div className={`rounded-lg border-2 ${priorityColors[feature.priority]} bg-navy-800/50 p-3`}>
      <div className="text-sm font-semibold text-chalk">{feature.name}</div>
      <div className="mt-1 text-xs text-chalk/60">{feature.estimatedHours}h</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {feature.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded bg-navy-700 px-1.5 py-0.5 text-[10px] text-chalk/60">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
