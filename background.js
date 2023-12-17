function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = (event) => {
    let str = decoder.decode(event.data, { stream: true });
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    // str = str.replace(/Example/g, "WebExtension Example");
    str = str
      .replace(
        "return (unpackr || globalRibbonUnpackr).unpack(packet);",
        "let catchInLog=((unpackr || globalRibbonUnpackr).unpack(packet)); console.log('in',catchInLog); return catchInLog;"
      )
      .replace("return merged;", "console.log('out', packet); return merged;");
    filter.write(encoder.encode(str));
    filter.disconnect();
  };

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ["*://tetr.io/js/tetrio.js*"] },
  ["blocking"]
);
