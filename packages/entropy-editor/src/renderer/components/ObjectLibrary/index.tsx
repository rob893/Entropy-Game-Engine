import type { ReactElement } from 'react';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

export function ObjectLibrary(): ReactElement {
  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader>
        Prefab Library
      </PanelHeader>
      <PanelContent>
        <p className="text-xs text-muted">
          Prefab Library — Coming Soon
        </p>
      </PanelContent>
    </Panel>
  );
}
