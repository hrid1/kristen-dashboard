"use client";

import {
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import BreadCrumb from "@/components/Reusable/BreadCrumb";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

// ---------------- TYPES ----------------

interface Answer {
  text: string;
}

type LayerTitle =
  | "Field_Note"
  | "The_Question"
  | "The_Journal"
  | "The_Experience"
  | "The_Reflection";

type DigType =
  | "Mental_Body"
  | "Emotional_Body"
  | "Physical_Body"
  | "Energy_Body";

type AnswerType = "option-type" | "text-field";
type IncludeOther = "yes" | "no";

interface Layer {
  questionTypeTitle: LayerTitle;
  xp: number;
  mainQuestion: string;
  answerType: AnswerType;
  includeOther: IncludeOther;
  otherText?: string;
  answers: Answer[];
  textareaPlaceholder?: string;
  correctAnswer?: string;
}

export interface DigFormData {
  digName: string;
  type: DigType[];
  layers: Layer[];
}

type BackendQuestionType = "Option" | "Text";

interface DigLayerPayload {
  question_name: LayerTitle;
  question_type: BackendQuestionType;
  point: number;
  options?: string[];
  other?: boolean;
  other_text?: string;
  text?: string;
  question?: string;
  correct_answer?: string;
}

interface DigPayload {
  title: string;
  type?: DigType[];
  layers: DigLayerPayload[];
}

interface CreateDigFormProps {
  onBack?: () => void;
  breadLink: { label: string; href?: string; onClick?: () => void }[];
}

// ---------------- LABEL MAP ----------------

const LAYER_TITLE_LABELS: Record<LayerTitle, string> = {
  Field_Note: "Field Note",
  The_Question: "The Question",
  The_Journal: "The Journal",
  The_Experience: "The Experience",
  The_Reflection: "The Reflection",
};

const DIG_TYPES: DigType[] = [
  "Mental_Body",
  "Emotional_Body",
  "Physical_Body",
  "Energy_Body",
];

// ---------------- DUPLICATE CHECK HELPER ----------------

function findDuplicateAnswers(layers: Layer[]): string[] {
  const errors: string[] = [];

  layers.forEach((layer, layerIndex) => {
    if (layer.answerType !== "option-type") return;

    const filledAnswers = layer.answers
      .map((a) => a.text.trim().toLowerCase())
      .filter(Boolean);

    const seen = new Set<string>();
    const duplicates = new Set<string>();

    filledAnswers.forEach((ans) => {
      if (seen.has(ans)) duplicates.add(ans);
      else seen.add(ans);
    });

    if (duplicates.size > 0) {
      errors.push(
        `Layer ${layerIndex + 1} (${LAYER_TITLE_LABELS[layer.questionTypeTitle]}): Duplicate answers found — "${[...duplicates].join('", "')}"`,
      );
    }
  });

  return errors;
}

// ---------------- MAIN COMPONENT ----------------

export function CreateDigForm({ onBack, breadLink }: CreateDigFormProps) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DigFormData>({
    defaultValues: {
      digName: "",
      type: [],
      layers: [
        {
          questionTypeTitle: "Field_Note",
          xp: 20,
          mainQuestion:
            "When you feel overwhelmed, what emotion is usually beneath the surface?",
          answerType: "option-type",
          includeOther: "yes",
          otherText: "Other (please specify)",
          answers: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctAnswer: "",
        },
        {
          questionTypeTitle: "The_Journal",
          xp: 20,
          mainQuestion: "",
          answerType: "text-field",
          includeOther: "no",
          answers: [],
          textareaPlaceholder:
            "Journal entry copies (if possible) to their actual journal...",
        },
        {
          questionTypeTitle: "The_Experience",
          xp: 20,
          mainQuestion:
            "If you dug in deeper to your response, set a simple goal for yourself to either:",
          answerType: "option-type",
          includeOther: "yes",
          otherText: "Other (please specify)",
          answers: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctAnswer: "",
        },
        {
          questionTypeTitle: "The_Reflection",
          xp: 20,
          mainQuestion: "Make a quick journal entry about this Dig.",
          answerType: "text-field",
          includeOther: "no",
          answers: [],
          textareaPlaceholder:
            "Journal entry copies (if possible) to their actual journal...",
        },
      ],
    },
  });

  const {
    fields: layerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "layers",
  });

  // ---------------- MUTATION ----------------

  const { mutateAsync: createDig, isPending } = useMutation({
    mutationFn: async (payload: DigPayload) => {
      const res = await axiosPrivate.post("/admin/digs", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Dig Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["digs"] });
      onBack?.();
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to create dig!");
    },
  });

  // ---------------- SUBMIT HANDLER ----------------

  const onSubmit = async (data: DigFormData) => {
    const duplicateErrors = findDuplicateAnswers(data.layers);
    if (duplicateErrors.length > 0) {
      duplicateErrors.forEach((err) => toast.error(err));
      return;
    }

    // Validate that option-type layers for Question/Experience have a correct answer
    for (let i = 0; i < data.layers.length; i++) {
      const layer = data.layers[i];
      const needsCorrectAnswer =
        (layer.questionTypeTitle === "Field_Note" ||
          layer.questionTypeTitle === "The_Question" ||
          layer.questionTypeTitle === "The_Experience") &&
        layer.answerType === "option-type";

      if (needsCorrectAnswer && !layer.correctAnswer?.trim()) {
        toast.error(
          `Layer ${i + 1} (${LAYER_TITLE_LABELS[layer.questionTypeTitle]}): Please select a correct answer.`,
        );
        return;
      }
    }

    const payload: DigPayload = {
      title: data.digName,
      ...(data.type.length > 0 ? { type: data.type } : {}),
      layers: data.layers.map((layer) => {
        const questionType: BackendQuestionType =
          layer.answerType === "option-type" ? "Option" : "Text";

        const isCorrectAnswerLayer =
          layer.questionTypeTitle === "Field_Note" ||
          layer.questionTypeTitle === "The_Question" ||
          layer.questionTypeTitle === "The_Experience";

        return {
          question_name: layer.questionTypeTitle,
          question_type: questionType,
          point: Number(layer.xp || 0),
          ...(layer.mainQuestion.trim()
            ? { question: layer.mainQuestion.trim() }
            : {}),
          ...(layer.answerType === "option-type"
            ? {
                options: layer.answers
                  .map((answer) => answer.text.trim())
                  .filter(Boolean),
                ...(layer.includeOther === "yes"
                  ? {
                      other: true,
                      other_text:
                        layer.otherText?.trim() || "Other (please specify)",
                    }
                  : {}),
              }
            : {
                ...(layer.textareaPlaceholder?.trim()
                  ? { text: layer.textareaPlaceholder.trim() }
                  : {}),
              }),
          ...(isCorrectAnswerLayer && layer.correctAnswer?.trim()
            ? { correct_answer: layer.correctAnswer.trim() }
            : {}),
        };
      }),
    };

    await createDig(payload);
  };

  // ---------------- UI ----------------

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-6 p-6 bg-[#FFFEFA]"
    >
      <BreadCrumb
        breadLink={breadLink.map((link) => ({
          ...link,
          onClick: link.onClick ? link.onClick : () => onBack?.(),
        }))}
      />

      <div className="border rounded-2xl p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Create New Dig</h1>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#C6A664] hover:bg-amber-400 py-3 px-4 cursor-pointer"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* DIG NAME */}
          <div className="space-y-2">
            <Label
              htmlFor="digName"
              className="text-[#777980] font-medium text-[14px]"
            >
              Dig Name
            </Label>
            <input
              id="digName"
              placeholder="Emotional Intelligence"
              {...register("digName", { required: "Dig name is required" })}
              className="border text-[#1D1F2C] font-medium text-[16px] w-full p-4 rounded-[16px]"
            />
            {errors.digName && (
              <p className="text-red-600 text-sm">{errors.digName.message}</p>
            )}
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-[#777980] font-medium text-[14px]">
            Dig Types
          </legend>
          <div className="flex flex-wrap gap-3">
            {DIG_TYPES.map((type) => {
              const selectedTypes = watch("type") || [];
              const checked = selectedTypes.includes(type);

              return (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const nextTypes = isChecked
                        ? [...selectedTypes, type]
                        : selectedTypes.filter(
                            (selectedType) => selectedType !== type,
                          );
                      setValue("type", nextTypes, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  {type.replace("_", " ")}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* LAYERS */}
        <div className="space-y-4">
          {layerFields.map((layer, layerIndex) => (
            <LayerForm
              key={layer.id}
              layerIndex={layerIndex}
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              onRemove={() => remove(layerIndex)}
            />
          ))}
        </div>

        {/* ADD NEW LAYER */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              append({
                questionTypeTitle: "Field_Note",
                xp: 0,
                mainQuestion: "",
                answerType: "option-type",
                includeOther: "no",
                otherText: "Other (please specify)",
                answers: [],
                correctAnswer: "",
              })
            }
            className="bg-[#C6A664] text-white text-[16px] font-medium cursor-pointer"
          >
            <Plus size={20} /> Add New Layer
          </Button>
        </div>
      </div>
    </form>
  );
}

// ---------------- LAYER COMPONENT ----------------

interface LayerFormProps {
  layerIndex: number;
  control: Control<DigFormData>;
  register: UseFormRegister<DigFormData>;
  setValue: UseFormSetValue<DigFormData>;
  watch: UseFormWatch<DigFormData>;
  onRemove: () => void;
}

function LayerForm({
  layerIndex,
  control,
  register,
  setValue,
  watch,
  onRemove,
}: LayerFormProps) {
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `layers.${layerIndex}.answers`,
  });

  const answerType = watch(`layers.${layerIndex}.answerType`) || "option-type";
  const includeOther = watch(`layers.${layerIndex}.includeOther`) || "yes";
  const questionTypeTitle =
    watch(`layers.${layerIndex}.questionTypeTitle`) || "Field_Note";
  const correctAnswer = watch(`layers.${layerIndex}.correctAnswer`) ?? "";
  const allAnswers = watch(`layers.${layerIndex}.answers`) || [];

  const showCorrectAnswer =
    questionTypeTitle === "Field_Note" ||
    questionTypeTitle === "The_Question" ||
    questionTypeTitle === "The_Experience";

  // ── Live duplicate detection per answer index ──────────────────────────
  const getDuplicateIndices = (): Set<number> => {
    const duplicateIndices = new Set<number>();
    const valueMap = new Map<string, number[]>();

    allAnswers.forEach((answer, idx) => {
      const val = answer.text.trim().toLowerCase();
      if (!val) return;
      if (!valueMap.has(val)) valueMap.set(val, []);
      valueMap.get(val)!.push(idx);
    });

    valueMap.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((i) => duplicateIndices.add(i));
      }
    });

    return duplicateIndices;
  };

  const duplicateIndices = getDuplicateIndices();

  // Clear correctAnswer if the answer text it pointed to is no longer present
  const handleAnswerChange = (changedIndex: number, newValue: string) => {
    const prevValue = allAnswers[changedIndex]?.text ?? "";
    if (correctAnswer === prevValue && prevValue !== newValue) {
      setValue(`layers.${layerIndex}.correctAnswer`, "");
    }
  };

  return (
    <div className="space-y-4 bg-[#F6F8FA] p-4 rounded-xl">
      {/* LAYER HEADER */}
      <div className="flex items-center justify-between">
        <div className="text-[#1F2937] font-semibold text-[20px]">
          Layer {layerIndex + 1} —{" "}
          <span className="text-[#C6A664]">
            {LAYER_TITLE_LABELS[questionTypeTitle as LayerTitle] ??
              questionTypeTitle}
          </span>
        </div>
        {layerIndex > 3 && (
          <Button
            type="button"
            variant="destructive"
            onClick={onRemove}
            className="rounded-xl"
          >
            Remove
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* QUESTION TYPE TITLE + XP */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Question Type Title</Label>
            <Select
              value={questionTypeTitle}
              onValueChange={(val: LayerTitle) => {
                setValue(`layers.${layerIndex}.questionTypeTitle`, val);
                // Clear correct answer when layer type changes
                setValue(`layers.${layerIndex}.correctAnswer`, "");
              }}
            >
              <SelectTrigger className="border rounded-md w-full bg-white py-7">
                <SelectValue placeholder="Select layer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Field_Note">Field Note</SelectItem>
                <SelectItem value="The_Journal">The Journal</SelectItem>
                <SelectItem value="The_Experience">The Experience</SelectItem>
                <SelectItem value="The_Reflection">The Reflection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>XP</Label>
            <input
              type="number"
              placeholder="20"
              {...register(`layers.${layerIndex}.xp`, { valueAsNumber: true })}
              className="border text-[#1D1F2C] font-medium text-[16px] w-full p-4 rounded-[16px] bg-white"
            />
          </div>
        </div>

        {/* MAIN QUESTION */}
        <div className="space-y-2">
          <Label>Main Question</Label>
          <Textarea
            placeholder="Enter the main question for this layer..."
            {...register(`layers.${layerIndex}.mainQuestion`)}
            className="border text-[#1D1F2C] font-medium text-[16px] w-full p-4 rounded-[16px] bg-white"
            rows={3}
          />
        </div>

        {/* ANSWER TYPE + INCLUDE OTHER */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Answer Type</Label>
            <Select
              value={answerType}
              onValueChange={(val: AnswerType) => {
                setValue(`layers.${layerIndex}.answerType`, val);
                // Clear correct answer when switching away from option type
                setValue(`layers.${layerIndex}.correctAnswer`, "");
              }}
            >
              <SelectTrigger className="border rounded-md w-full bg-white py-7">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option-type">Option Type</SelectItem>
                <SelectItem value="text-field">Text Field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Include Other Option</Label>
            <Select
              value={includeOther}
              onValueChange={(val: IncludeOther) =>
                setValue(`layers.${layerIndex}.includeOther`, val)
              }
            >
              <SelectTrigger className="border rounded-md w-full bg-white py-7">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {answerType === "option-type" && includeOther === "yes" && (
          <div className="space-y-2">
            <Label>Other Option Placeholder</Label>
            <input
              {...register(`layers.${layerIndex}.otherText`)}
              placeholder="Other (please specify)"
              className="border text-[#1D1F2C] font-medium text-[16px] w-full p-4 rounded-[16px] bg-white"
            />
          </div>
        )}

        {/* OPTION TYPE ANSWERS */}
        {answerType === "option-type" && (
          <>
            {/* Helper hint + correct answer status */}
            <div className="flex items-center justify-between">
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
                  Click the circle on any answer to mark it as the correct
                  answer.
                </p>
              )}
              {showCorrectAnswer && correctAnswer && (
                <span className="text-xs text-[#C6A664] font-medium">
                  ✓ Correct: {correctAnswer}
                </span>
              )}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label>Answer {answerIndex + 1}</Label>
                    <div className="relative flex items-center gap-2">
                      <input
                        {...register(
                          `layers.${layerIndex}.answers.${answerIndex}.text`,
                          {
                            onChange: (e) =>
                              handleAnswerChange(answerIndex, e.target.value),
                          },
                        )}
                        placeholder={`Answer option ${answerIndex + 1}`}
                        className={`border text-[#1D1F2C] font-medium text-[16px] p-4 pr-12 rounded-[16px] bg-white w-full transition-all ${
                          isDuplicate
                            ? "border-2 border-red-400 bg-red-50"
                            : isCorrect
                              ? "border-2 border-[#C6A664]"
                              : "border"
                        }`}
                      />

                      {/* Tick button — only for Question & Experience */}
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
                          className={`absolute right-10 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                            isCorrect
                              ? "bg-[#C6A664] border-[#C6A664] text-white"
                              : "border-gray-300 text-transparent hover:border-[#C6A664] hover:text-[#C6A664]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
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

                      {/* Remove answer button */}
                      <button
                        type="button"
                        onClick={() => {
                          // If this was the correct answer, clear it
                          if (correctAnswer === answerValue) {
                            setValue(`layers.${layerIndex}.correctAnswer`, "");
                          }
                          removeAnswer(answerIndex);
                        }}
                        className="absolute right-3 text-gray-300 hover:text-red-400 transition-colors"
                        title="Remove answer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Inline duplicate warning */}
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

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => appendAnswer({ text: "" })}
                className="w-full h-[90px] gap-3 flex flex-col justify-center items-center cursor-pointer"
              >
                <Plus size={24} className="text-[#C6A664]" />
                <span>Add Answer</span>
              </Button>
            </div>
          </>
        )}

        {/* TEXT FIELD */}
        {answerType === "text-field" && (
          <div className="space-y-2">
            <Label>Answer Field Placeholder</Label>
            <Textarea
              placeholder="Journal entry copies..."
              {...register(`layers.${layerIndex}.textareaPlaceholder`)}
              className="border text-[#1D1F2C] font-medium text-[16px] w-full p-4 rounded-[16px] bg-white h-[100px] md:h-[130px]"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  );
}
