// components/dashboard/tools/PoemTool.ts

import { API, BlockTool, BlockToolData } from "@editorjs/editorjs";

interface PoemLine {
  sadr: string;
  ajuuz?: string; // Optional for modern poetry
}

interface PoemData extends BlockToolData {
  style: "classic" | "modern"; // 👈 The new switch
  cols: PoemLine[];
  caption: string;
}

export default class PoemTool implements BlockTool {
  api: API;
  readOnly: boolean;
  data: PoemData;
  nodes: { [key: string]: HTMLElement };

  constructor({
    data,
    api,
    readOnly,
  }: {
    data: PoemData;
    api: API;
    readOnly: boolean;
  }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      style: data.style || "classic",
      cols: data.cols || [{ sadr: "", ajuuz: "" }],
      caption: data.caption || "",
    };
    this.nodes = {
      wrapper: document.createElement("div"),
      linesContainer: document.createElement("div"),
      caption: document.createElement("div"),
    };
  }

  static get toolbox() {
    return { title: "Poem", icon: "📜" };
  }

  static get inlineToolbar() {
    return true;
  }

  // 1. Create the Toggle Button in the Block Settings (the "Tunes" menu)
  renderSettings() {
    const settings = [
      { name: "classic", label: "عمودي (شطرين)", icon: "📖" },
      { name: "modern", label: "تفعيلة (سطر واحد)", icon: "📝" },
    ];

    const wrapper = document.createElement("div");
    wrapper.classList.add("ce-popover__items");

    settings.forEach((tune) => {
      const button = document.createElement("div");
      const icon = document.createElement("div");
      const label = document.createElement("div");

      button.classList.add("ce-popover-item");
      icon.classList.add("ce-popover-item__icon");
      icon.classList.add("ce-popover-item__icon--tool");
      label.classList.add("ce-popover-item__title");

      icon.innerHTML = tune.icon;
      label.innerHTML = tune.name;

      button.appendChild(icon);
      button.appendChild(label);

      button.title = tune.label;

      // Highlight the active style
      if (this.data.style === tune.name) {
        button.classList.add("ce-popover-item--active");
      }

      button.onclick = () => {
        this.data.style = tune.name as "classic" | "modern";
        this._updateView(); // Refresh the UI instantly

        // Toggle the active class in the menu
        const buttons = wrapper.querySelectorAll(".ce-popover-item");
        buttons.forEach((b) => b.classList.remove("ce-popover-item--active"));
        button.classList.add("ce-popover-item--active");
      };

      wrapper.appendChild(button);
    });

    return wrapper;
  }

  _updateView() {
    // Re-render lines based on the new style
    this.nodes.linesContainer.innerHTML = "";
    this.data.cols.forEach((line) => {
      this.nodes.linesContainer.appendChild(
        this.createLineNode(line.sadr, line.ajuuz),
      );
    });
  }

  createLineNode(sadrText = "", ajuuzText = "") {
    const row = document.createElement("div");
    row.classList.add(
      "py-2",
      "relative",
      "group/line",
      "w-full",
      "poem-line-row",
    );

    if (this.data.style === "classic") {
      row.classList.add(
        "flex",
        "flex-col",
        "md:flex-row",
        "md:justify-between",
        "items-stretch",
        "md:items-center",
        "gap-y-2",
        "md:gap-y-0",
        "md:gap-x-12",
      );
    } else {
      row.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "max-w-prose",
        "mx-auto",
      );
    }

    const sadr = document.createElement("div");
    const ajuuz = document.createElement("div");

    // Base shared classes for both inputs
    [sadr, ajuuz].forEach((el, index) => {
      el.contentEditable = "true";
      el.classList.add(
        "outline-none",
        "text-xl",
        "font-serif",
        "border-b",
        "border-transparent",
        "focus:border-primary/20",
        "transition-colors",
      );
      el.setAttribute(
        "data-placeholder",
        index === 0 ? "الشطر الأول..." : "الشطر الثاني...", // Updated placeholder
      );
    });

    // Apply specific alignments and widths based on style
    if (this.data.style === "classic") {
      // Sadr (First half) - Right aligned, pushed right on mobile
      sadr.classList.add(
        "flex-1",
        "text-right",
        "self-start",
        "w-[90%]",
        "md:w-auto",
        "md:text-justify",
      );

      // Ajuuz (Second half) - Left aligned, pushed left on mobile
      ajuuz.classList.add(
        "flex-1",
        "text-left",
        "self-end",
        "w-[90%]",
        "md:w-auto",
        "md:text-justify",
      );
    } else {
      // Modern (Single line) - Centered
      sadr.classList.add("w-full", "text-center");
    }

    sadr.innerHTML = sadrText;
    ajuuz.innerHTML = ajuuzText;

    row.appendChild(sadr);

    // Only append the second input if it's a classic poem
    if (this.data.style === "classic") {
      row.appendChild(ajuuz);
    }

    return row;
  }

  render(): HTMLElement {
    const { wrapper, linesContainer, caption } = this.nodes;
    wrapper.classList.add(
      "flex",
      "flex-col",
      "gap-y-2",
      "bg-white/5",
      "p-6",
      "rounded-2xl",
      "border",
      "border-card-hover",
    );

    this._updateView();

    const addBtn = document.createElement("button");
    addBtn.innerText = "+ إضافة سطر";
    addBtn.classList.add(
      "text-sm",
      "text-primary/60",
      "hover:text-primary",
      "mt-4",
      "self-center",
    );
    addBtn.type = "button";
    addBtn.onclick = () => linesContainer.appendChild(this.createLineNode());

    caption.contentEditable = "true";
    caption.classList.add(
      "text-sm",
      "text-center",
      "text-muted-foreground",
      "mt-4",
      "outline-none",
      "caption",
    );
    caption.setAttribute("data-placeholder", "اسم الشاعر...");
    caption.innerHTML = this.data.caption;

    wrapper.appendChild(linesContainer);
    wrapper.appendChild(addBtn);
    wrapper.appendChild(caption);

    return wrapper;
  }

  save(blockContent: HTMLElement): PoemData {
    const rows = blockContent.querySelectorAll(".poem-line-row");
    const caption = blockContent.querySelector(".caption") as HTMLElement;

    const cols: PoemLine[] = [];
    rows.forEach((row) => {
      const sadr = row.querySelector("div:first-child") as HTMLElement;
      const ajuuz = row.querySelector("div:nth-child(2)") as HTMLElement;

      if (sadr && sadr.innerText.trim()) {
        cols.push({
          sadr: sadr.innerHTML,
          ajuuz:
            this.data.style === "classic" ? ajuuz?.innerHTML || "" : undefined,
        });
      }
    });

    return {
      style: this.data.style,
      cols,
      caption: caption?.innerHTML || "",
    };
  }
}
