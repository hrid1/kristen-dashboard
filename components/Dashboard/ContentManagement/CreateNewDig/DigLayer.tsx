"use client";

interface Option {
    id: string;
    label: string;
}

interface DigLayerProps {
    id: string;
    number: string;
    title: string;
    question: string;
    type: "textarea" | "multiple-choice";
    options?: Option[]; 
    placeholder?: string;
    xp: number;
    answer?: string;
    onAnswerChange: (value: string) => void;
}

export default function DigLayer({
    id,
    number,
    title,
    question,
    type,
    options = [],
    placeholder,
    xp,
    answer,
    onAnswerChange,
}: DigLayerProps) {
    return (
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full px-4 py-2 font-medium text-sm">
                        Layer {number}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                </div>
                <div className="text-sm font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
                    {xp} XP
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                    {type === "multiple-choice" ? "The Question" : "Answer Options"}
                </p>
                <p className="text-base md:text-lg font-semibold text-foreground">
                    {question}
                </p>
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-4 block">
                    Answer Options
                </label>

                {type === "multiple-choice" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                                <input
                                    type="radio"
                                    name={id}
                                    value={option.id}
                                    checked={answer === option.id}
                                    onChange={(e) => onAnswerChange(e.target.value)}
                                    className="w-5 h-5 cursor-pointer accent-primary"
                                />
                                <span className="text-foreground font-medium">{option.label}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <textarea
                        value={answer || ""}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full min-h-32 p-4 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                )}
            </div>
        </div>
    );
}
