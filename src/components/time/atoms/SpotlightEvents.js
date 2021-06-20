import React from "react";
import { getEventCategories, styleSpotlight } from "../../../common/utilities";
import {
  AVAILABLE_SHAPES,
  EVENT_MARKER_OFFSETS,
  DASH_SPOTLIGHT_RADIUS,
} from "../../../common/constants";
import SpotlightMarker from "../../atoms/SpotlightMarker";

const TimelineSpotlightEvents = ({
  getEventX,
  getEventY,
  eventRadius,
  categories,
  selectedEvents,
}) => {
  function renderSpotlightEvent(acc, event) {
    function renderMarker(y, styles) {
      let offset = 0;
      let radius = eventRadius;
      if (event.shape) {
        const { shape } = event.shape;
        switch (shape) {
          case AVAILABLE_SHAPES.DIAMOND:
            offset = EVENT_MARKER_OFFSETS.DIAMOND;
            radius = eventRadius + 5;
            break;
          case AVAILABLE_SHAPES.SQUARE:
            offset = EVENT_MARKER_OFFSETS.SQUARE;
            radius = eventRadius + 5;
            break;
          case AVAILABLE_SHAPES.DASH:
            offset = EVENT_MARKER_OFFSETS.DASH;
            radius = DASH_SPOTLIGHT_RADIUS;
            break;
          default:
            offset = 0;
            radius = eventRadius + 5;
            break;
        }
      }

      return (
        <SpotlightMarker
          x={getEventX(event) + offset}
          y={y}
          radius={radius}
          styles={styles}
        />
      );
    }

    const evShadows = getEventCategories(event, categories).map((cat) =>
      getEventY({ ...event, category: cat })
    );

    const styles = styleSpotlight(event.spotlight);

    if (evShadows.length > 0) {
      evShadows.forEach((y) => acc.push(renderMarker(y, styles)));
    } else {
      acc.push(renderMarker(getEventY(event), styles));
    }
    return acc;
  }

  return (
    <g clipPath="url(#clip)">
      {selectedEvents.reduce(renderSpotlightEvent, [])}
    </g>
  );
};

export default TimelineSpotlightEvents;