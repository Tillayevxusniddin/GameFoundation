import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { CodeEditor } from "../../src/editor/CodeEditor";

afterEach(() => {
  cleanup();
});

describe("CodeEditor lifecycle", () => {
  it("qiymat yangilanganda mavjud EditorView'ni qayta ishlatadi", () => {
    const { getByTestId, rerender } = render(
      <CodeEditor
        value="const name = 's';"
        language="javascript"
        onChange={() => {}}
        ariaLabel="Kod muharriri"
      />,
    );
    const host = getByTestId("codemirror-host");
    const contentBefore = host.querySelector(".cm-content");

    rerender(
      <CodeEditor
        value="const name = 's w a d';"
        language="javascript"
        onChange={() => {}}
        ariaLabel="Kod muharriri"
      />,
    );

    expect(host.querySelector(".cm-content")).toBe(contentBefore);
  });
});