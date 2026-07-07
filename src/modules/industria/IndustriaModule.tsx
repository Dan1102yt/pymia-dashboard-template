import { EntityTracker } from '../../components/entity-tracker/EntityTracker';
import { clientConfig } from '../../config/client.config';

export function IndustriaModule() {
  const { industria } = clientConfig;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{industria.entityNamePlural}</h1>
        <p className="text-sm text-slate-500">
          {industria.entities.length} {industria.entityNamePlural.toLowerCase()} registradas · gestión y seguimiento
        </p>
      </div>
      <EntityTracker config={industria} />
    </div>
  );
}
