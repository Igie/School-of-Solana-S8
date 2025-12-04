// src/components/ui/Select.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className = "",
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((opt) => opt.value === value);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    return (
        <div
            ref={ref}
            className={`relative inline-block text-sm text-gray-200 ${className}`}
        >
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center justify-between px-0.5 py-1 bg-surface border border-white/10 rounded-md hover:border-accent-1/40 transition-colors"
            >
                <span className={selected ? "text-gray-100" : "text-gray-400"}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-100 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute mt-0 w-full bg-surface border border-white/10 rounded-sm z-50 animate-in fade-in slide-in-from-top-1 content-end-safe">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`block w-full gap-y-0.5 text-left px-0.5 py-0 rounded-sm bg-surface hover:bg-accent-1/20 
                                ${opt.value === value ? "text-gray-100" : "text-gray-400"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
