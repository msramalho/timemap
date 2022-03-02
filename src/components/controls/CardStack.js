import React from "react";
import { connect } from "react-redux";
import {
  Card,
} from "@forensic-architecture/design-system/dist/react";

import * as selectors from "../../selectors";
import { getFilterIdxFromColorSet } from "../../common/utilities";
import copy from "../../common/data/copy.json";

class CardStack extends React.Component {
  constructor() {
    super();
    this.refs = {};
    this.refCardStack = React.createRef();
    this.refCardStackContent = React.createRef();
  }

  componentDidUpdate() {
    const isNarrative = !!this.props.narrative;

    if (isNarrative) {
      this.scrollToCard();
    }
  }

  scrollToCard() {
    const duration = 500;
    const element = this.refCardStack.current;
    const cardScroll = this.refs[this.props.narrative.current].current
      .offsetTop;

    const start = element.scrollTop;
    const change = cardScroll - start;
    let currentTime = 0;
    const increment = 20;

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t -= 1;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function () {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) setTimeout(animateScroll, increment);
    };
    animateScroll();
  }

  generateTemplate({ event, colors, coloringSet, getFilterIdxFromColorSet }) {
    console.log(event);
    let cardComponents = [
      [
        {
          kind: "date",
          title: "Incident Date",
          value: event.datetime || event.date || ``,
        },
        {
          kind: "text",
          title: "Location",
          value: event.location || `—`,
        },
      ],
      [{ kind: "line-break", times: 0.4 }],
      [
        {
          kind: "text",
          title: "Summary",
          value: event.description || ``,
          scaleFont: 1.1,
        },
      ],
      // [{ kind: "line-break", times: 0.4 }], 
    ];

    let domainFromUrl = (url) => {
      let matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      return matches && matches[1];
    }

    let getViolenceLevel = (violence) => {
      let violenceColors = {
        1: "#8BC34A",
        2: "#FFEB3B",
        3: "#FFC107",
        4: "#FF9800",
        5: "#FF5722",
      }
      try {
        let v = Number.parseInt(violence)
        if (v >= 1) {
          return { message: `${v}/5`, color: violenceColors[v] };
        }
      } catch (_) { }
      return { message: 'unknown', color: "#FFC107" }
    }

    //TODO: hide or allow toggle on video when graphic
    if (event.sources !== undefined) {
      event.sources.forEach((source, sid) => {
        let violenceLevel = getViolenceLevel(source.violence);
        console.log(source.violence, violenceLevel)
        cardComponents.push([{ kind: "line", times: 0.4 }]);
        cardComponents.push([
          {
            kind: "markdown",
            title: `Source #${sid + 1}`,
            value: `<p>${source.description}</p><p><span class="muted-text">violence level: </span><span style="background-color:${violenceLevel.color}">${violenceLevel.message}</span></p>`
          },
        ]);
        console.log("card markdown ready");
        cardComponents.push([
          {
            kind: "button",
            value:
              [[source.url, `original (${domainFromUrl(source.url)})`],
              [source.archive, 'archive']]
                .filter(([url, _]) => url !== undefined && url !== "")
                .map(([url, text]) => ({
                  text: text,
                  href: url,
                  color: null,
                  onClick: () => window.open(url, "_blank"),
                })),
          },
        ]);
        console.log("card button ready");
        // if (source.archive !== undefined) {
        //   cardComponents.push([
        //     {
        //       kind: "media",
        //       title: `Media ${sid + 1}`,
        //       value: [{ src: source.archive }]
        //     },
        //   ]);
        //   console.log("card media ready");
        // }
      })
    }
    console.log("card components ready");

    return cardComponents;
  }

  renderCards(events, selections) {
    // if no selections provided, select all
    if (!selections) {
      selections = events.map((e) => true);
    }
    this.refs = [];
    /**
     * In the original version the following code is used:
     * `const generateTemplate = generateCardLayout[this.props.cardUI.layout.template];`
     * and `this.props.cardUI.layout.template` defaults to `basic` but could be other values
     * if configured here: https://github.com/forensic-architecture/design-system/blob/master/src/lib/templates/
    */

    return events.map((event, idx) => {
      const thisRef = React.createRef();
      this.refs[idx] = thisRef;

      return (
        <Card
          ref={thisRef}
          content={this.generateTemplate({
            event,
            colors: this.props.colors,
            coloringSet: this.props.coloringSet,
            getFilterIdxFromColorSet,
          })}
          language={this.props.language}
          isLoading={this.props.isLoading}
          isSelected={selections[idx]}
        />
      );
    });
  }

  renderSelectedCards() {
    const { selected } = this.props;

    console.log(selected)
    if (selected.length > 0) {
      return this.renderCards(selected);
    }
    return null;
  }

  renderNarrativeCards() {
    const { narrative } = this.props;
    const showing = narrative.steps;

    const selections = showing.map((_, idx) => idx === narrative.current);

    return this.renderCards(showing, selections);
  }

  renderCardStackHeader() {
    const headerLang = copy[this.props.language].cardstack.header;

    return (
      <div
        id="card-stack-header"
        className="card-stack-header"
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className="side-menu-burg is-active">
          <span />
        </button>
        <p className="header-copy top">
          {`${this.props.selected.length} ${headerLang}`}
        </p>
      </div>
    );
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>{this.renderSelectedCards()}</ul>
      </div>
    );
  }

  renderNarrativeContent() {
    return (
      <div
        id="card-stack-content"
        className="card-stack-content"
        ref={this.refCardStackContent}
      >
        <ul>{this.renderNarrativeCards()}</ul>
      </div>
    );
  }

  render() {
    const { isCardstack, selected, narrative, timelineDims } = this.props;
    // TODO: make '237px', which is the narrative header, less hard-coded
    const height = `calc(100% - 237px - ${timelineDims.height}px)`;
    if (selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id="card-stack"
            className={`card-stack
            ${isCardstack ? "" : " folded"}`}
          >
            {this.renderCardStackHeader()}
            {this.renderCardStackContent()}
          </div>
        );
      } else {
        return (
          <div
            id="card-stack"
            ref={this.refCardStack}
            className={`card-stack narrative-mode
            ${isCardstack ? "" : " folded"}`}
            style={{ height }}
          >
            {this.renderNarrativeContent()}
          </div>
        );
      }
    }

    return <div />;
  }
}

function mapStateToProps(state) {
  return {
    narrative: selectors.selectActiveNarrative(state),
    selected: selectors.selectSelected(state),
    sourceError: state.app.errors.source,
    language: state.app.language,
    isCardstack: state.app.flags.isCardstack,
    isLoading: state.app.flags.isFetchingSources,
    cardUI: state.ui.card,
    colors: state.ui.coloring.colors,
    coloringSet: state.app.associations.coloringSet,
    features: state.features,
  };
}

export default connect(mapStateToProps)(CardStack);
