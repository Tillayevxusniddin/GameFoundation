// docs/05_UI_UX_DESIGN.md — CodeMirror 6 editori.
// Ctrl/Cmd+Enter ishga tushirish, Ctrl/Cmd+S draftni saqlaydi; xato qatori
// highlight qilinadi. Editor brauzerda o'rnatilmasa textarea fallback ishlaydi.

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { basicSetup } from "codemirror";
import {
  Compartment,
  EditorState,
  StateEffect,
  StateField,
} from "@codemirror/state";
import {
  type DecorationSet,
  Decoration,
  EditorView,
  keymap,
} from "@codemirror/view";
import { languageExtension, type LanguageId } from "./languages";

export interface CodeEditorProps {
  value: string;
  language: LanguageId;
  onChange: (value: string) => void;
  onRun?: () => void;
  onSaveDraft?: () => void;
  errorLine?: number | null;
  ariaLabel: string;
}

interface PlainEditorProps {
  value: string;
  onKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  ariaLabel: string;
  onChange: (value: string) => void;
}

export function PlainTextArea({
  value,
  onChange,
  onKeyDown,
  ariaLabel,
}: PlainEditorProps): JSX.Element {
  return (
    <textarea
      className="wn-editor wn-editor--plain"
      aria-label={ariaLabel}
      value={value}
      spellCheck={false}
      onChange={(event): void => onChange(event.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}

const setErrorLine = StateEffect.define<number | null>();
const errorLineDecoration = Decoration.line({
  class: "wn-editor-error-line",
});

function clampedLineNumber(state: EditorState, line: number): number {
  const count = state.doc.lines;
  if (!Number.isFinite(line)) {
    return 1;
  }
  return Math.min(Math.max(1, Math.floor(line)), Math.max(1, count));
}

const errorLineField = StateField.define<DecorationSet>({
  create: (): DecorationSet => Decoration.none,
  update(value: DecorationSet, transaction) {
    let next = value.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (!effect.is(setErrorLine)) {
        continue;
      }
      const line = effect.value;
      if (line === null) {
        next = Decoration.none;
      } else {
        const target = transaction.state.doc.line(
          clampedLineNumber(transaction.state, line),
        );
        next = Decoration.set([errorLineDecoration.range(target.from)]);
      }
    }
    return next;
  },
  provide: (field) => EditorView.decorations.from(field),
});

const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      backgroundColor: "#171a22",
      color: "#e6e9f0",
      fontSize: "13px",
    },
    ".cm-scroller": {
      fontFamily:
        "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
      lineHeight: "1.55",
    },
    ".cm-gutters": {
      backgroundColor: "#14161c",
      color: "#5b6478",
      border: "none",
    },
    "&.cm-focused": {
      outline: "2px solid #60a5fa",
      outlineOffset: "-2px",
    },
  },
  { dark: true },
);

// Togri prop 'value' tashqi holatga moslanguncha editor ichiga yozish
// davom etadi; prop o'zgarsa (masalan reset) doc moslashtiriladi.
export function CodeEditor({
  value,
  language,
  onChange,
  onRun,
  onSaveDraft,
  errorLine,
  ariaLabel,
}: CodeEditorProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartmentRef = useRef<Compartment | null>(null);
  const [failed, setFailed] = useState(false);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const onSaveDraftRef = useRef(onSaveDraft);
  onSaveDraftRef.current = onSaveDraft;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || viewRef.current !== null) {
      return;
    }
    const languageCompartment = new Compartment();
    languageCompartmentRef.current = languageCompartment;
    try {
      const state = EditorState.create({
        doc: valueRef.current,
        extensions: [
          basicSetup,
          languageCompartment.of(languageExtension(language)),
          editorTheme,
          EditorView.lineWrapping,
          keymap.of([
            {
              key: "Mod-Enter",
              run: (): boolean => {
                onRunRef.current?.();
                return true;
              },
            },
            {
              key: "Mod-s",
              run: (): boolean => {
                onSaveDraftRef.current?.();
                return true;
              },
            },
          ]),
          EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
          errorLineField,
        ],
      });
      const view = new EditorView({ state, parent: container });
      viewRef.current = view;
    } catch {
      setFailed(true);
    }
  }, [ariaLabel, language]);

  useEffect(() => {
    const view = viewRef.current;
    if (view === null) {
      return;
    }
    if (view.state.doc.toString() !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (view === null) {
      return;
    }
    const compartment = languageCompartmentRef.current;
    if (compartment === null) {
      return;
    }
    view.dispatch({
      effects: compartment.reconfigure(languageExtension(language)),
    });
  }, [language]);

  useEffect(() => {
    const view = viewRef.current;
    if (view === null) {
      return;
    }
    view.dispatch({ effects: setErrorLine.of(errorLine ?? null) });
  }, [errorLine]);

  useEffect(() => {
    const view = viewRef.current;
    return () => {
      view?.destroy();
      viewRef.current = null;
    };
  }, []);

  if (failed) {
    return (
      <PlainTextArea
        value={value}
        ariaLabel={ariaLabel}
        onChange={onChange}
        onKeyDown={handleShortcut}
      />
    );
  }

  return (
    <div
      className="wn-editor"
      ref={containerRef}
      data-testid="codemirror-host"
      aria-label={ariaLabel}
    />
  );

  function handleShortcut(event: ReactKeyboardEvent<HTMLTextAreaElement>): void {
    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      onRunRef.current?.();
    } else if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      onSaveDraftRef.current?.();
    }
  }
}