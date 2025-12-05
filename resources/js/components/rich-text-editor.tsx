import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Unlink, Redo, Undo } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 border-b bg-muted/30 p-2">
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Toggle italic"
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 w-[1px] bg-border" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Toggle bullet list"
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Toggle ordered list"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <div className="mx-1 w-[1px] bg-border" />

            <Button
                size="sm"
                variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                onClick={setLink}
                className="h-9 px-2.5"
                type="button"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>

            {editor.isActive('link') && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="h-9 px-2.5"
                    type="button"
                >
                    <Unlink className="h-4 w-4" />
                </Button>
            )}

            <div className="ml-auto flex gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-9 px-2.5"
                    type="button"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-9 px-2.5"
                    type="button"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false, 
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false, 
                },
            }),
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none p-3 min-h-[150px] focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sinkronisasi konten jika value berubah dari luar (misal reset form)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Hanya update jika konten benar-benar beda untuk mencegah cursor jumping
            // Cek sederhana: jika value kosong (reset), bersihkan editor
            if (value === '' || value === '<p></p>') {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div className={cn("flex flex-col rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}