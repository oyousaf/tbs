"use client";

import { duration, gbp, groupIntros, groupsIn, services, type RegionId, type Service } from "@/lib/menu";
import { actions, useStore } from "@/lib/store";

export function ServiceRow({ service, compact }: { service: Service; compact?: boolean }) {
  const { tray } = useStore();
  const added = tray.includes(service.id);
  return (
    <li className={`grid grid-cols-[1fr_auto] items-center gap-x-4 ${compact ? "py-2.5" : "py-3.5"}`}>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <h4 className="font-semibold text-pretty">{service.name}</h4>
          <span aria-hidden className="hidden min-w-6 grow translate-y-[-3px] border-b-2 border-dotted border-line sm:block" />
          <p className="shrink-0 font-semibold whitespace-nowrap text-accent tabular-nums">
            {service.fromPrice && <span className="text-sm font-normal">from </span>}
            {gbp(service.pence)}
          </p>
        </div>
        <p className="text-sm text-muted">
          {!service.estimated && duration(service.minutes)}
          {!service.estimated && service.note && " · "}
          {service.note}
        </p>
      </div>
      <button
        type="button"
        onClick={() => actions.toggle(service.id)}
        aria-pressed={added}
        aria-label={`${added ? "Remove" : "Add"} ${service.name}`}
        className={`btn min-w-22 px-4! text-sm ${added ? "btn-plum" : "btn-line"}`}
      >
        {added ? "Added" : "Add"}
      </button>
    </li>
  );
}

export function RegionMenu({ region, query = "" }: { region: RegionId; query?: string }) {
  const q = query.trim().toLowerCase();
  const groups = groupsIn(region);
  return (
    <div className="space-y-10">
      {groups.map((group) => {
        const items = services.filter(
          (s) => s.region === region && s.group === group && (!q || `${s.name} ${group}`.toLowerCase().includes(q)),
        );
        if (!items.length) return null;
        return (
          <section key={group}>
            <h3 className="font-display text-2xl text-accent sm:text-3xl">{group}</h3>
            {groupIntros[group] && <p className="mt-2 max-w-2xl text-muted">{groupIntros[group]}</p>}
            <ul className="mt-3 divide-y divide-accent/12">
              {items.map((s) => (
                <ServiceRow key={s.id} service={s} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
