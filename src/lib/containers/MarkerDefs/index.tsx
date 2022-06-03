import React, { ReactNode, Component } from 'react';
import { BasicClosedMarker, BasicMarker } from '@lib/components/Anchor';
import type { Marker, MarkerDefsProps, MarkerTemplatesType, MarkerTemplateType } from '@lib/types';

const defaultTemplates: MarkerTemplatesType = {
  tailBasic: BasicMarker,
  tailBasicClosed: BasicClosedMarker,
};

const defaultMarkers: Marker[] = [
  { id: 'tail-marker__basic', type: 'tailBasic' },
  { id: 'tail-marker__basic-closed', type: 'tailBasicClosed' },
];

function findTemplate(
  type: string,
  passedTemplates?: MarkerTemplatesType,
): MarkerTemplateType | null {
  return passedTemplates?.[type] ?? defaultTemplates[type] ?? null;
}

class MarkerDefs extends Component<MarkerDefsProps> {
  renderMarker(markers: Marker[]) {
    const { markerTemplates } = this.props;
    return markers.reduce<ReactNode[]>((lastRes, marker) => {
      const { type, ...MarkerWrapperProps } = marker;
      const Marker = findTemplate(type, markerTemplates);
      if (Marker !== null) {
        lastRes.push(<Marker key={marker.id} {...MarkerWrapperProps} />);
      }
      return lastRes;
    }, []);
  }

  render() {
    const { markers = [] } = this.props;
    return (
      <defs>
        {this.renderMarker(defaultMarkers)}
        {this.renderMarker(markers)}
      </defs>
    );
  }
}

export default MarkerDefs;
