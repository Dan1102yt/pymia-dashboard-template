import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { FinancieroModule } from './modules/financiero/FinancieroModule';
import { ClientesModule } from './modules/clientes/ClientesModule';
import { VentasModule } from './modules/ventas/VentasModule';
import { IndustriaModule } from './modules/industria/IndustriaModule';
import { AsistenteModule } from './modules/asistente/AsistenteModule';
import { clientConfig } from './config/client.config';

// Build first active module path for redirect
function getDefaultPath() {
  const order = ['financiero', 'clientes', 'ventas', 'industria', 'asistente'] as const;
  for (const key of order) {
    if (clientConfig.modules[key]) return `/${key}`;
  }
  return '/financiero';
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultPath()} replace />} />
          {clientConfig.modules.financiero && <Route path="/financiero" element={<FinancieroModule />} />}
          {clientConfig.modules.clientes && <Route path="/clientes" element={<ClientesModule />} />}
          {clientConfig.modules.ventas && <Route path="/ventas" element={<VentasModule />} />}
          {clientConfig.modules.industria && <Route path="/industria" element={<IndustriaModule />} />}
          {clientConfig.modules.asistente && <Route path="/asistente" element={<AsistenteModule />} />}
          <Route path="*" element={<Navigate to={getDefaultPath()} replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
