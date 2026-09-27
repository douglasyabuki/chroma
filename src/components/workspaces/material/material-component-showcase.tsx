import { PlusIcon, SaveIcon } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { MaterialButton } from "@/components/ui/material/button";
import { MaterialCard } from "@/components/ui/material/card";
import { MaterialCheckbox } from "@/components/ui/material/checkbox";
import { MaterialChip } from "@/components/ui/material/chip";
import { MaterialRipple } from "@/components/ui/material/ripple";
import { MaterialSwitch } from "@/components/ui/material/switch";
import {
  MaterialTabs,
  MaterialTabsList,
  MaterialTabsPanel,
  MaterialTabsTrigger,
} from "@/components/ui/material/tabs";
import { MaterialTextField } from "@/components/ui/material/text-field";

const categories = ["Design", "Research", "Development"];
const notificationLabels = ["Project updates", "Team mentions"];
const defaultProject = {
  name: "A new idea",
  email: "hello@example.com",
  categories: ["Design"],
  notifications: [true, false],
  autosave: true,
};

export function MaterialComponentShowcase() {
  const headingId = useId();
  const [project, setProject] = useState(defaultProject);
  const [submitted, setSubmitted] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [status, setStatus] = useState({
    message: "Changes stay in this preview.",
    revision: 0,
  });
  const announce = (message: string) =>
    setStatus((previous) => ({ message, revision: previous.revision + 1 }));
  const nameError =
    submitted && !project.name.trim() ? "Enter a project name." : undefined;
  const emailError =
    submitted && emailInvalid ? "Enter a valid email address." : undefined;
  const allNotifications = project.notifications.every(Boolean);
  const someNotifications = project.notifications.some(Boolean);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.namedItem("contactEmail");
    const invalidEmail =
      email instanceof HTMLInputElement && !email.validity.valid;
    setSubmitted(true);
    setEmailInvalid(invalidEmail);
    if (!project.name.trim() || invalidEmail) {
      announce("Check the project details before saving.");
      const field = form.elements.namedItem(
        !project.name.trim() ? "projectName" : "contactEmail",
      );
      if (field instanceof HTMLInputElement) field.focus();
    } else {
      announce(`Saved ${project.name.trim()} in this preview.`);
    }
  };
  const reset = () => {
    setProject(defaultProject);
    setSubmitted(false);
    setEmailInvalid(false);
    announce("Project settings restored to their defaults.");
  };

  return (
    <section
      className="text-(--md-sys-color-on-surface)"
      aria-labelledby={headingId}
    >
      <div className="mb-6 flex items-end justify-between gap-6 max-[1150px]:flex-col max-[1150px]:items-start max-[1150px]:gap-2 [&>p]:max-w-70 max-[1150px]:[&>p]:max-w-none">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[1.4px] text-(--md-sys-color-on-surface-variant) uppercase">
            Material / In context
          </p>
          <h2 id={headingId} className="text-2xl leading-8 font-medium">
            A theme you can try.
          </h2>
        </div>
        <p className="text-sm leading-5 text-(--md-sys-color-on-surface-variant)">
          Edit a project, choose your preferences, and see semantic colors at
          work.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-4 max-[1150px]:grid-cols-1">
        <MaterialCard variant="outlined">
          <h3 className="mb-3 text-xl leading-7 font-medium wrap-anywhere">
            Project settings
          </h3>
          <MaterialTabs defaultValue="details">
            <MaterialTabsList aria-label="Project settings">
              <MaterialTabsTrigger value="details">Details</MaterialTabsTrigger>
              <MaterialTabsTrigger value="preferences">
                Preferences
              </MaterialTabsTrigger>
            </MaterialTabsList>
            <MaterialTabsPanel value="details">
              <form noValidate onSubmit={save} className="flex flex-col gap-5">
                <MaterialTextField
                  label="Project name"
                  name="projectName"
                  value={project.name}
                  required
                  errorText={nameError}
                  supportingText="Give your next idea a name."
                  onChange={(event) =>
                    setProject({ ...project, name: event.target.value })
                  }
                />
                <MaterialTextField
                  variant="filled"
                  label="Contact email"
                  name="contactEmail"
                  type="email"
                  autoComplete="email"
                  value={project.email}
                  errorText={emailError}
                  supportingText="Optional address for project updates."
                  onChange={(event) => {
                    setProject({ ...project, email: event.target.value });
                    setEmailInvalid(!event.target.validity.valid);
                  }}
                />
                <fieldset className="m-0 min-w-0 border-0 p-0 [&>legend]:mb-1 [&>legend]:text-sm [&>legend]:leading-5 [&>legend]:font-medium">
                  <legend>Project categories</legend>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {categories.map((category) => (
                      <MaterialChip
                        key={category}
                        variant="filter"
                        selected={project.categories.includes(category)}
                        onSelectedChange={(selected) =>
                          setProject({
                            ...project,
                            categories: selected
                              ? [...project.categories, category]
                              : project.categories.filter(
                                  (item) => item !== category,
                                ),
                          })
                        }
                      >
                        {category}
                      </MaterialChip>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <MaterialButton type="submit" leadingIcon={<SaveIcon />}>
                    <MaterialRipple />
                    Save project
                  </MaterialButton>
                  <MaterialButton variant="outlined" onClick={reset}>
                    <MaterialRipple />
                    Reset
                  </MaterialButton>
                </div>
              </form>
            </MaterialTabsPanel>
            <MaterialTabsPanel value="preferences">
              <div className="flex flex-col gap-5">
                <fieldset className="m-0 min-w-0 border-0 p-0 [&>legend]:mb-1 [&>legend]:text-sm [&>legend]:leading-5 [&>legend]:font-medium">
                  <legend>Notifications</legend>
                  <MaterialCheckbox
                    label="All notifications"
                    checked={allNotifications}
                    indeterminate={someNotifications && !allNotifications}
                    onChange={(event) =>
                      setProject({
                        ...project,
                        notifications: project.notifications.map(
                          () => event.target.checked,
                        ),
                      })
                    }
                  />
                  <div className="ps-5">
                    {notificationLabels.map((label, index) => (
                      <MaterialCheckbox
                        key={label}
                        label={label}
                        checked={project.notifications[index]}
                        onChange={(event) =>
                          setProject({
                            ...project,
                            notifications: project.notifications.map(
                              (enabled, i) =>
                                i === index ? event.target.checked : enabled,
                            ),
                          })
                        }
                      />
                    ))}
                  </div>
                </fieldset>
                <MaterialSwitch
                  label="Autosave"
                  checked={project.autosave}
                  onChange={(event) =>
                    setProject({ ...project, autosave: event.target.checked })
                  }
                />
                <p className="text-sm leading-5 text-(--md-sys-color-on-surface-variant)">
                  These settings only affect the example project.
                </p>
              </div>
            </MaterialTabsPanel>
          </MaterialTabs>
        </MaterialCard>
        <div className="flex flex-col gap-5">
          <MaterialCard variant="filled">
            <p className="mb-2 text-[10px] font-semibold tracking-[1.4px] text-(--md-sys-color-on-surface-variant) uppercase">
              Project summary
            </p>
            <h3 className="mb-3 text-xl leading-7 font-medium wrap-anywhere">
              {project.name.trim() || "Untitled project"}
            </h3>
            <p className="text-sm leading-5 text-(--md-sys-color-on-surface-variant)">
              {project.categories.join(" · ") || "No categories selected"}
            </p>
            <dl className="my-5 flex flex-col gap-3 text-sm leading-5 [&_dd]:m-0 [&_dt]:text-(--md-sys-color-on-surface-variant) [&>div]:flex [&>div]:flex-wrap [&>div]:justify-between [&>div]:gap-2">
              <div>
                <dt>Notifications</dt>
                <dd>
                  {project.notifications.filter(Boolean).length} of 2 enabled
                </dd>
              </div>
              <div>
                <dt>Autosave</dt>
                <dd>{project.autosave ? "On" : "Off"}</dd>
              </div>
            </dl>
            <MaterialChip
              onClick={() =>
                announce("A project reminder was added in this preview.")
              }
            >
              Add a reminder
            </MaterialChip>
          </MaterialCard>
          <MaterialCard variant="elevated" className="flex flex-col gap-5">
            <div>
              <h3 className="mb-3 text-xl leading-7 font-medium wrap-anywhere">
                States and actions
              </h3>
              <p className="text-sm leading-5 text-(--md-sys-color-on-surface-variant)">
                Different emphasis, the same color system.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <MaterialButton
                variant="tonal"
                leadingIcon={<PlusIcon />}
                onClick={() =>
                  announce("A project copy was created in this preview.")
                }
              >
                <MaterialRipple />
                Duplicate
              </MaterialButton>
              <MaterialButton
                variant="text"
                onClick={() =>
                  announce(
                    "Edit Details or Preferences, then save your example project.",
                  )
                }
              >
                <MaterialRipple />
                Help
              </MaterialButton>
              <MaterialButton
                variant="elevated"
                onClick={() =>
                  announce("The project is ready to share in this preview.")
                }
              >
                <MaterialRipple />
                Share
              </MaterialButton>
              <MaterialButton disabled>
                <MaterialRipple />
                Publish
              </MaterialButton>
            </div>
            <MaterialTextField
              label="Workspace"
              value="Personal workspace"
              disabled
              supportingText="Workspace changes are unavailable in this example."
            />
            <div>
              <MaterialCheckbox
                label="Admin notifications"
                defaultChecked
                disabled
              />
              <MaterialSwitch label="Team sync" disabled />
              <MaterialChip
                variant="filter"
                selected
                disabled
                onSelectedChange={() => {}}
              >
                Archived
              </MaterialChip>
            </div>
          </MaterialCard>
        </div>
      </div>
      <p
        className="mt-4 min-h-10 text-sm leading-5 text-(--md-sys-color-on-surface-variant)"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span key={status.revision}>{status.message}</span>
      </p>
    </section>
  );
}
