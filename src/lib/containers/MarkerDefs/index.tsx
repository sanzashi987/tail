import React, { ReactNode, PureComponent } from "react";
import { BasicClosedMarker, BasicMarker } from "@app/components/Anchor";
import type { Marker, MarkerDefsProps, MarkerTemplatesType, MarkerTemplateType } from "@app/types";


const defaultTemplates: MarkerTemplatesType = {
  'tailBasic': BasicMarker,
  'tailBasicClosed': BasicClosedMarker
}

const defaultMarkers: Marker[] = [
  { id: 'tail-marker__basic', type: 'tailBasic' },
  { id: 'tail-marker__basic-closed', type: 'tailBasicClosed' }
]

function findTemplate(
  type: string,
  passedTemplates?: MarkerTemplatesType
): MarkerTemplateType | null {
  return passedTemplates?.[type] ?? defaultTemplates[type] ?? null
}


class MarkerDefs extends PureComponent<MarkerDefsProps> {

  // optional approach to load user-developed markers
  // but this runs as a singleton which will fail to render to tail instance
  // simultaneously in one app
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