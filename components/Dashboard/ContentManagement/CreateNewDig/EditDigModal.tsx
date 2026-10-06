"use client";

import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */

type LayerTitle =
  | "The_Question"
  | "The_Journal"
  | "The_Experience"
  | "The_Reflection";

type AnswerType = "option-type" | "text-field";
type IncludeOther = "yes" | "no";

interface Answer {
  text: string;
}

interface Layer {
  id?: string;
  questionTypeTitle: LayerTitle;
  xp: number;
  mainQuestion: string;
  answerType: AnswerType;
  includeOther: IncludeOther;
  answers: Answer[];
  textareaPlaceholder?: string;
  correctAnswer?: string;
}

interface DigFormData {
  digName: string;
  layers: Layer[];
}

interface BackendLayer {
  id: string;
  question_name: LayerTitle;
  question_type: "Option" | "Text";
  point: number;
  question: string | null;
  options: string[];
  other: boolean;
  other_text: string | null;
  text: string | null;
  correct_answer: string | null;
}

interface BackendDig {
  id: string;
  title: string;
  layers: BackendLayer[];
}

interface EditDigModalProps {
  open: boolean;
  onClose: () => void;
  digId: string | null;
  initialData?: BackendDig;
}

/* ---------------- LABEL MAP ---------------- */

const LAYER_TITLE_LABELS: Record<LayerTitle, string> = {
  The_Question: "The Question",
  The_Journal: "The Journal",
  The_Experience: "The Experience",
  The_Reflection: "The Reflection",
};

/* ---------------- DUPLICATE CHECK ---------------- */

function findDuplicateAnswers(layers: Layer[]): string[] {
  const errors: string[] = [];
  layers.forEach((layer, layerIndex) => {
    if (layer.answerType !== "option-type") return;
    const filled = layer.answers
      .map((a) => a.text.trim().toLowerCase())
      .filter(Boolean);
    const seen = new Set<string>();
    const dupes = new Set<string>();
    filled.forEach((v) => (seen.has(v) ? dupes.add(v) : seen.add(v)));
    if (dupes.size > 0) {
      errors.push(
        `Layer ${layerIndex + 1} (${LAYER_TITLE_LABELS[layer.questionTypeTitle]}): Duplicate answers — "${[...dupes].join('", "')}"`,
      );
    }
  });
  return errors;
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function EditDigModal({
  open,
  onClose,
  digId,
  initialData,
}: EditDigModalProps) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, reset, setValue, watch } =
    useForm<DigFormData>({
      defaultValues: { digName: "", layers: [] },
    });

  const { fields: layerFields } = useFieldArray({
    control,
    name: "layers",
  });

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (initialData && open) {
      reset({
        digName: initialData.title,
        layers: initialData.layers.map((layer) => ({
          id: layer.id,
          questionTypeTitle: layer.question_name,
          xp: layer.point,
          mainQuestion: layer.question || "",
          answerType:
            layer.question_type === "Option" ? "option-type" : "text-field",
          includeOther: layer.other ? "yes" : "no",
          answers: layer.options.map((opt) => ({ text: opt })),
          textareaPlaceholder: layer.text || "",
          correctAnswer: layer.correct_answer || "",
        })),
      });
    }
  }, [initialData, open, reset]);

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (data: DigFormData) => {
    if (!digId) return;

    const duplicateErrors = findDuplicateAnswers(data.layers);
    if (duplicateErrors.length > 0) {
      duplicateErrors.forEach((err) => toast.error(err));
      return;
    }

    // Validate correct answer for Question/Experience option layers
    for (let i = 0; i < data.layers.length; i++) {
      const layer = data.layers[i];
      const needsCorrectAnswer =
        (layer.questionTypeTitle === "The_Question" ||
          layer.questionTypeTitle === "The_Experience") &&
        layer.answerType === "option-type";

      if (needsCorrectAnswer && !layer.correctAnswer?.trim()) {
        toast.error(
          `Layer ${i + 1} (${LAYER_TITLE_LABELS[layer.questionTypeTitle]}): Please select a correct answer.`,
        );
        return;
      }
    }

    try {
      const payload = {
        title: data.digName,
        layers: data.layers.map((layer) => {
          const isCorrectAnswerLayer =
            layer.questionTypeTitle === "The_Question" ||
            layer.questionTypeTitle === "The_Experience";

          return {
            ...(layer.id ? { id: layer.id } : {}),
            question_name: layer.questionTypeTitle,
            question_type:
              layer.answerType === "option-type" ? "Option" : "Text",
            point: Number(layer.xp || 0),
            options:
              layer.answerType === "option-type"
                ? layer.answers.map((a) => a.text).filter(Boolean)
                : [],
            other: layer.includeOther === "yes",
            other_text:
              layer.includeOther === "yes" ? "Other (please specify)" : "",
            text:
              layer.answerType === "text-field"
                ? layer.textareaPlaceholder || ""
                : null,
            question: layer.mainQuestion || null,
            correct_answer: isCorrectAnswerLayer
              ? layer.correctAnswer?.trim() || null
              : null,
          };
        }),
      };

      const res = await axiosPrivate.patch(
        `/admin/digs/update/${digId}`,
        payload,
      );

      if (res.data.success) {
        toast.success("Dig Updated Successfully!");
        queryClient.invalidateQueries({ queryKey: ["digs"] });
        queryClient.invalidateQueries({ queryKey: ["dig", digId] });
        onClose();
      } else {
        toast.error(res.data.message || "Update failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[85vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Dig</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* TITLE */}
          <div className="space-y-2">
            <Label
              htmlFor="digName"
              className="text-[#777980] font-medium text-sm"
            >
              Dig Name
            </Label>
            <Input
              id="digName"
              {...register("digName", { required: "Dig name is required" })}
              placeholder="Enter dig name"
              className="rounded-xl p-4 h-auto"
            />
          </div>

          {/* LAYERS */}
          {layerFields.map((field, index) => (
            <LayerFormSection
              key={field.id}
              layerIndex={index}
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          ))}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C6A664] hover:bg-amber-500 text-white"
            >
              Update Dig
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- LAYER SECTION ---------------- */

interface LayerFormSectionProps {
  layerIndex: number;
  control: Control<DigFormData>;
  register: UseFormRegister<DigFormData>;
  setValue: UseFormSetValue<DigFormData>;
  watch: UseFormWatch<DigFormData>;
}

function LayerFormSection({
  layerIndex,
  control,
  register,
  setValue,
  watch,
}: LayerFormSectionProps) {
  const {
    fields: answerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `layers.${layerIndex}.answers`,
  });

  const answerType = watch(`layers.${layerIndex}.answerType`) ?? "option-type";
  const includeOther = watch(`layers.${layerIndex}.includeOther`) ?? "no";
  const questionTypeTitle =
    watch(`layers.${layerIndex}.questionTypeTitle`) ?? "The_Question";
  const correctAnswer = watch(`layers.${layerIndex}.correctAnswer`) ?? "";
  const allAnswers = watch(`layers.${layerIndex}.answers`) ?? [];

  const showCorrectAnswer =
    questionTypeTitle === "The_Question" ||
    questionTypeTitle === "The_Experience";

  /* Live duplicate detection */
  const getDuplicateIndices = (): Set<number> => {
    const dupeIndices = new Set<number>();
    const valueMap = new Map<string, number[]>();
    allAnswers.forEach((answer, idx) => {
      const val = answer.text.trim().toLowerCase();
      if (!val) return;
      if (!valueMap.has(val)) valueMap.set(val, []);
      valueMap.get(val)!.push(idx);
    });
    valueMap.forEach((indices) => {
      if (indices.length > 1) indices.forEach((i) => dupeIndices.add(i));
    });
    return dupeIndices;
  };

  const duplicateIndices = getDuplicateIndices();

  // Auto-clear correctAnswer when its text changes
  const handleAnswerChange = (changedIndex: number, newValue: string) => {
    const prevValue = allAnswers[changedIndex]?.text ?? "";
    if (correctAnswer === prevValue && prevValue !== newValue) {
      setValue(`layers.${layerIndex}.correctAnswer`, "");
    }
  };

  return (
    <div className="border p-5 rounded-xl space-y-4 bg-[#F6F8FA]">
      {/* Layer header */}
      <h3 className="text-base font-semibold text-[#1F2937]">
        Layer {layerIndex + 1} —{" "}
        <span className="text-[#C6A664]">
          {LAYER_TITLE_LABELS[questionTypeTitle] ?? questionTypeTitle}
        </span>
      </h3>

      {/* Question Type Title + XP */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm text-[#777980]">Question Type Title</Label>
          <Select
            value={questionTypeTitle}
            onValueChange={(val: LayerTitle) => {
              setValue(`layers.${layerIndex}.questionTypeTitle`, val);
              setValue(`layers.${layerIndex}.correctAnswer`, "");
            }}
          >
            <SelectTrigger className="bg-white rounded-xl h-12">
              <SelectValue placeholder="Select layer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="The_Question">The Question</SelectItem>
              <SelectItem value="The_Journal">The Journal</SelectItem>
              <SelectItem value="The_Experience">The Experience</SelectItem>
              <SelectItem value="The_Reflection">The Reflection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-[#777980]">XP</Label>
          <Input
            type="number"
            placeholder="20"
            {...register(`layers.${layerIndex}.xp`, { valueAsNumber: true })}
            className="bg-white rounded-xl h-12"
          />
        </div>
      </div>

      {/* Main Question */}
      <div className="space-y-1.5">
        <Label className="text-sm text-[#777980]">Main Question</Label>
        <Textarea
          placeholder="Enter the main question for this layer..."
          {...register(`layers.${layerIndex}.mainQuestion`)}
          className="bg-white rounded-xl"
          rows={3}
        />
      </div>

      {/* Answer Type + Include Other */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm text-[#777980]">Answer Type</Label>
          <Select
            value={answerType}
            onValueChange={(val: AnswerType) => {
              setValue(`layers.${layerIndex}.answerType`, val);
              setValue(`layers.${layerIndex}.correctAnswer`, "");
            }}
          >
            <SelectTrigger className="bg-white rounded-xl h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option-type">Option Type</SelectItem>
              <SelectItem value="text-field">Text Field</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-[#777980]">Include Other Option</Label>
          <Select
            value={includeOther}
            onValueChange={(val: IncludeOther) =>
              setValue(`layers.${layerIndex}.includeOther`, val)
            }
          >
            <SelectTrigger className="bg-white rounded-xl h-12">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* OPTION-TYPE ANSWERS */}
      {answerType === "option-type" && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            {showCorrectAnswer && (
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="inline-flex w-4 h-4 rounded-full bg-[#C6A664] items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Click the circle on any answer to mark it as the correct answer.
              </p>
            )}
            {showCorrectAnswer && correctAnswer && (
              <span className="text-xs text-[#C6A664] font-medium">
                ✓ Correct: {correctAnswer}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {answerFields.map((answer, answerIndex) => {
              const answerValue = watch(
                `layers.${layerIndex}.answers.${answerIndex}.text`,
              );
              const isCorrect =
                showCorrectAnswer &&
                !!answerValue &&
                correctAnswer === answerValue;
              const isDuplicate = duplicateIndices.has(answerIndex);

              return (
                <div key={answer.id} className="space-y-1">
                  <Label className="text-xs text-[#777980]">
                    Answer {answerIndex + 1}
                  </Label>
                  <div className="relative flex items-center">
                    <input
                      {...register(
                        `layers.${layerIndex}.answers.${answerIndex}.text`,
                        {
                          onChange: (e) =>
                            handleAnswerChange(answerIndex, e.target.value),
                        },
                      )}
                      placeholder={`Answer option ${answerIndex + 1}`}
                      className={`border text-[#1D1F2C] font-medium text-sm p-3 rounded-xl bg-white w-full transition-all ${
                        isDuplicate
                          ? "border-2 border-red-400 bg-red-50"
                          : isCorrect
                            ? "border-2 border-[#C6A664]"
                            : "border"
                      } ${showCorrectAnswer ? "pr-16" : "pr-9"}`}
                    />

                    {/* Correct answer tick */}
                    {showCorrectAnswer && (
                      <button
                        type="button"
                        title="Mark as correct answer"
                        onClick={() => {
                          if (answerValue?.trim()) {
                            setValue(
                              `layers.${layerIndex}.correctAnswer`,
                              isCorrect ? "" : answerValue,
                            );
                          }
                        }}
                        className={`absolute right-9 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                          isCorrect
                            ? "bg-[#C6A664] border-[#C6A664] text-white"
                            : "border-gray-300 text-transparent hover:border-[#C6A664] hover:text-[#C6A664]"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    )}

                    {/* Remove answer */}
                    <button
                      type="button"
                      onClick={() => {
                        if (correctAnswer === answerValue) {
                          setValue(`layers.${layerIndex}.correctAnswer`, "");
                        }
                        remove(answerIndex);
                      }}
                      className="absolute right-2 flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                      title="Remove answer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isDuplicate && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Duplicate answer
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ text: "" })}
            className="w-full gap-2 cursor-pointer border-dashed"
          >
            <Plus size={16} className="text-[#C6A664]" />
            Add Answer
          </Button>
        </>
      )}

      {/* TEXT FIELD */}
      {answerType === "text-field" && (
        <div className="space-y-1.5">
          <Label className="text-sm text-[#777980]">
            Answer Field Placeholder
          </Label>
          <Textarea
            placeholder="Journal entry copies..."
            {...register(`layers.${layerIndex}.textareaPlaceholder`)}
            className="bg-white rounded-xl"
            rows={4}
          />
        </div>
      )}
    </div>
  );
}
