import { useState } from 'react';
import { EntityTracker } from '../../components/entity-tracker/EntityTracker';
import { clientConfig } from '../../config/client.config';
import type { EntityMock } from '../../types/config.types';

export function IndustriaModule() {
  const { industria } = clientConfig;
  const [entities, setEntities] = useState<EntityMock[]>(() => [...industria.entities]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{industria.entityNamePlural}</h1>
        <p className="text-sm text-slate-500">
          {entities.length} {industria.entityNamePlural.toLowerCase()} registradas · gestión y seguimiento
        </p>
      </div>
      <EntityTracker
        config={industria}
        entities={entities}
        onCreateEntity={entity => setEntities(prev => [entity, ...prev])}
      />
    </div>
  );
}
