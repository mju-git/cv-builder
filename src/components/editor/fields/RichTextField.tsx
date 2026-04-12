import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';

export function RichTextField(props: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        orderedList: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: props.value || '<ul><li></li></ul>',
    editorProps: {
      attributes: {
        class:
          'min-h-[110px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus-within:border-zinc-950',
      },
    },
    onUpdate({ editor }) {
      props.onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (props.value !== current) editor.commands.setContent(props.value || '<ul><li></li></ul>');
  }, [editor, props.value]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        />
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        />
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullets"
        />
        <ToolbarButton
          active={editor.isActive('link')}
          onClick={() => {
            const prev = editor.getAttributes('link').href as string | undefined;
            const next = window.prompt('Link URL', prev ?? '');
            if (next === null) return;
            if (next.trim().length === 0) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: next.trim() }).run();
          }}
          label="Link"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton(props: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        'h-8 rounded-md border px-2 text-xs font-medium',
        props.active ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 bg-white hover:bg-zinc-50',
      ].join(' ')}
    >
      {props.label}
    </button>
  );
}

