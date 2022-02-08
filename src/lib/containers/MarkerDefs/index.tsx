import React, { ReactNode, Component } from "react";
import { BasicClosedMarker, BasicMarker } from "@app/components/Anchor";
import type { Marker, MarkerDefsProps, MarkerTemplatesType, MarkerTemplateType } from "@app/types";


const defaultTemplates: MarkerTemplatesType = {
  'basic': BasicMarker,
  'basicClosed': BasicClosedMarker
}

const defaultMarkers: Marker[] = [
  { id: 'tail-marker__basic', type: 'basic' },
  { id: 'tail-marker__basic-closed', type: 'basicClosed' }
]

function findTemplate(
  type: string,
  passedTemplates?: MarkerTemplatesType
): MarkerTemplateType | null {
  return passedTemplates?.[type] ?? defaultTemplates[type] ?? null
}


class MarkerDefs extends Component<MarkerDefsProps> {

  // optional approach to load user-developed markers
  // static supportedMarkers = defaultTemplates
  // static useMarkers = (templates: MarkerTemplatesType) => {}

  renderMarker(markers: Marker[]) {
    const { templates } = this.props
    return markers.reduce<ReactNode[]>((lastRes, marker) => {
      const { type, ...MarkerWrapperProps } = marker
      const Marker = findTemplate(marker.type, templates)
      if (Marker !== null) {
        lastRes.push(
          <Marker key={marker.id} {...MarkerWrapperProps} />
        )
      }
      return lastRes
    }, [])
  }

  render() {
    const { markers = [] } = this.props
    return <defs>
      {this.renderMarker(defaultMarkers)}
      {this.renderMarker(markers)}
    </defs>
  }
}

export default MarkerDefs