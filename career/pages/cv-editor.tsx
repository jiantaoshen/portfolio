"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  LocaleSwitcher,
  localeLabels,
} from "../components/dashboard/locale-switcher";

import type {
  AboutContent,
  AboutEducationItem,
  AboutSkillGroup,
  Locale,
} from "../lib/types";

import {
  useCareerWorkspace,
} from "../workspace";


function blankSkillGroup(): AboutSkillGroup {
  return {
    title: "New category",
    items: [],
  };
}


function blankEducation(): AboutEducationItem {
  return {
    period: "",
    degree: "",
    school: "",
    description: "",
    thesis: "",
    thesisUrl: "",
  };
}


export function CvEditorPage() {
  const {
    data,
    actions,
    saving,
    mode,
  } = useCareerWorkspace();

  const [
    locale,
    setLocale,
  ] =
    useState<Locale>("en");

  const draft =
    data.about[locale];

  function setDraft(
    updater:
      | AboutContent
      | ((
          current: AboutContent,
        ) => AboutContent),
  ) {
    actions.stageAbout(
      locale,
      updater,
    );
  }

  const sourcePath =
    `i18n/locales/${locale}/about.json`;


  function updateSkillGroup(
    index: number,
    next: AboutSkillGroup,
  ) {
    setDraft(
      (current) => ({
        ...current,

        skills: {
          ...current.skills,

          items:
            current.skills.items.map(
              (group, i) =>
                i === index
                  ? next
                  : group,
            ),
        },
      }),
    );
  }


  function removeSkillGroup(
    index: number,
  ) {
    setDraft(
      (current) => ({
        ...current,

        skills: {
          ...current.skills,

          items:
            current.skills.items.filter(
              (_, i) =>
                i !== index,
            ),
        },
      }),
    );
  }


  function updateEducation(
    index: number,
    next: AboutEducationItem,
  ) {
    setDraft(
      (current) => ({
        ...current,

        education: {
          ...current.education,

          items:
            current.education.items.map(
              (item, i) =>
                i === index
                  ? next
                  : item,
            ),
        },
      }),
    );
  }


  function removeEducation(
    index: number,
  ) {
    setDraft(
      (current) => ({
        ...current,

        education: {
          ...current.education,

          items:
            current.education.items.filter(
              (_, i) =>
                i !== index,
            ),
        },
      }),
    );
  }


  return (
    <div className="space-y-6">
      {/* Page header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
            CV / About
          </h1>

          <p className="mt-2 mb-0 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Each language keeps its own
            editor state, matching the
            three About JSON files
            directly.
          </p>
        </div>

        <LocaleSwitcher
          value={locale}
          onChange={setLocale}
        />
      </div>


      {/* Story */}

      <Card>
        <CardHeader>
          <CardTitle>
            Background / Story
          </CardTitle>

          <CardDescription>
            Maps to{" "}
            <code>
              story.title
            </code>{" "}
            and{" "}
            <code>
              story.paragraphs
            </code>
            .
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {draft.story.paragraphs.map(
              (
                paragraph,
                index,
              ) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <Textarea
                    rows={4}
                    value={
                      paragraph
                    }
                    onChange={(
                      event,
                    ) =>
                      setDraft(
                        (
                          current,
                        ) => ({
                          ...current,

                          story: {
                            ...current.story,

                            paragraphs:
                              current.story.paragraphs.map(
                                (
                                  value,
                                  i,
                                ) =>
                                  i ===
                                  index
                                    ? event
                                        .target
                                        .value
                                    : value,
                              ),
                          },
                        }),
                      )
                    }
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove paragraph"
                    onClick={() =>
                      setDraft(
                        (
                          current,
                        ) => ({
                          ...current,

                          story: {
                            ...current.story,

                            paragraphs:
                              current.story.paragraphs.filter(
                                (
                                  _,
                                  i,
                                ) =>
                                  i !==
                                  index,
                              ),
                          },
                        }),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setDraft(
                  (current) => ({
                    ...current,

                    story: {
                      ...current.story,

                      paragraphs: [
                        ...current.story
                          .paragraphs,
                        "",
                      ],
                    },
                  }),
                )
              }
            >
              <Plus className="mr-2 size-4" />

              Add paragraph
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Skills */}

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>
              Skills
            </CardTitle>

            <CardDescription>
              Each card maps directly
              to one item in{" "}
              <code>
                skills.items
              </code>
              .
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft(
                (current) => ({
                  ...current,

                  skills: {
                    ...current.skills,

                    items: [
                      ...current.skills
                        .items,

                      blankSkillGroup(),
                    ],
                  },
                }),
              )
            }
          >
            <Plus className="mr-2 size-4" />

            Add category
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 xl:grid-cols-2">
            {draft.skills.items.map(
              (
                group,
                index,
              ) => (
                <SkillGroupEditor
                  key={`${locale}-${index}`}
                  group={group}
                  onChange={(
                    next,
                  ) =>
                    updateSkillGroup(
                      index,
                      next,
                    )
                  }
                  onDelete={() =>
                    removeSkillGroup(
                      index,
                    )
                  }
                />
              ),
            )}
          </div>
        </CardContent>
      </Card>


      {/* Education */}

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>
              Education & Learning
            </CardTitle>

            <CardDescription>
              Maps directly to{" "}
              <code>
                education.items
              </code>
              , including optional
              thesis and thesis URL.
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft(
                (current) => ({
                  ...current,

                  education: {
                    ...current.education,

                    items: [
                      ...current
                        .education
                        .items,

                      blankEducation(),
                    ],
                  },
                }),
              )
            }
          >
            <Plus className="mr-2 size-4" />

            Add education
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {draft.education.items.map(
              (
                item,
                index,
              ) => (
                <EducationEditor
                  key={`${locale}-${index}`}
                  item={item}
                  onChange={(
                    next,
                  ) =>
                    updateEducation(
                      index,
                      next,
                    )
                  }
                  onDelete={() =>
                    removeEducation(
                      index,
                    )
                  }
                />
              ),
            )}
          </div>
        </CardContent>
      </Card>


      {/* Save bar */}

      <Card className="sticky bottom-4 z-10 shadow-lg">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge
              variant="outline"
            >
              {locale}
            </Badge>

            <span className="font-mono text-xs">
              {sourcePath}
            </span>
          </div>

          <Button
            type="button"
            disabled={saving}
            onClick={() =>
              void actions
                .saveAbout(
                  locale,
                  draft,
                )
                .catch(
                  () => {},
                )
            }
          >
            <Save className="mr-2 size-4" />

            {saving
              ? "Saving…"
              : mode === "trial"
                ? "Apply locally"
                : `Save ${localeLabels[locale]}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


function SkillGroupEditor({
  group,
  onChange,
  onDelete,
}: {
  group: AboutSkillGroup;
  onChange: (
    next: AboutSkillGroup,
  ) => void;
  onDelete: () => void;
}) {
  const [
    itemsText,
    setItemsText,
  ] =
    useState(
      group.items.join(
        ", ",
      ),
    );

  const [
    editingItems,
    setEditingItems,
  ] =
    useState(false);

  const itemsValue =
    group.items.join(
      ", ",
    );

  useEffect(() => {
    if (!editingItems) {
      setItemsText(
        itemsValue,
      );
    }
  }, [
    itemsValue,
    editingItems,
  ]);

  return (
    <Card className="bg-background">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Input
            value={
              group.title
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...group,

                title:
                  event.target
                    .value,
              })
            }
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete skill category"
            onClick={
              onDelete
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Field label="Other technologies (comma separated)">
          <Textarea
            rows={3}
            value={
              itemsText
            }
            onFocus={() =>
              setEditingItems(
                true,
              )
            }
            onBlur={() =>
              setEditingItems(
                false,
              )
            }
            onChange={(
              event,
            ) => {
              setItemsText(
                event.target
                  .value,
              );

              onChange({
                ...group,

                items:
                  splitTags(
                    event.target
                      .value,
                  ),
              });
            }}
            placeholder="ASP.NET Core, REST APIs, JWT"
          />
        </Field>
      </CardContent>
    </Card>
  );
}


function EducationEditor({
  item,
  onChange,
  onDelete,
}: {
  item: AboutEducationItem;
  onChange: (
    next: AboutEducationItem,
  ) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="bg-background">
      <CardContent className="grid gap-4 p-4 md:grid-cols-2">
        <Field label="Period">
          <Input
            value={
              item.period
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...item,

                period:
                  event.target
                    .value,
              })
            }
          />
        </Field>


        <Field label="Degree / learning activity">
          <Input
            value={
              item.degree
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...item,

                degree:
                  event.target
                    .value,
              })
            }
          />
        </Field>


        <Field label="School / location">
          <Input
            value={
              item.school
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...item,

                school:
                  event.target
                    .value,
              })
            }
          />
        </Field>

        <div />


        <div className="md:col-span-2">
          <Field label="Description">
            <Textarea
              rows={4}
              value={
                item.description ??
                ""
              }
              onChange={(
                event,
              ) =>
                onChange({
                  ...item,

                  description:
                    event.target
                      .value,
                })
              }
            />
          </Field>
        </div>


        <Field label="Thesis (optional)">
          <Input
            value={
              item.thesis ??
              ""
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...item,

                thesis:
                  event.target
                    .value,
              })
            }
          />
        </Field>


        <Field label="Thesis URL (optional)">
          <Input
            value={
              item.thesisUrl ??
              ""
            }
            onChange={(
              event,
            ) =>
              onChange({
                ...item,

                thesisUrl:
                  event.target
                    .value,
              })
            }
          />
        </Field>


        <div className="md:col-span-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={
              onDelete
            }
          >
            <Trash2 className="mr-2 size-4" />

            Delete education item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


function splitTags(
  value: string,
) {
  return value
    .split(",")
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean);
}


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
      </Label>

      {children}
    </div>
  );
}