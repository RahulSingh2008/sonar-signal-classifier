
    const form = document.querySelector("#datasheet-form");
    const fileInput = document.querySelector("#datasheet");
    const fileStatus = document.querySelector("#file-status");
    const preview = document.querySelector("#preview");
    const previewSummary = document.querySelector("#preview-summary");
    const previewHead = document.querySelector(".data-table thead");
    const previewBody = document.querySelector(".data-table tbody");
    const previewNote = document.querySelector("#preview-note");
    const copyStatus = document.querySelector("#copy-status");
    const pasteRowForm = document.querySelector("#paste-row-form");
    const pastedRowInput = document.querySelector("#pasted-row");
    const pasteStatus = document.querySelector("#paste-status");
    const pastedRowResult = document.querySelector("#pasted-row-result");
    const pastedRowPreview = document.querySelector("#pasted-row-preview");
    const previewLimit = 100;

    function parseCsv(text) {
      const rows = [];
      let row = [];
      let field = "";
      let inQuotes = false;
      const content = text.replace(/^\uFEFF/, "");

      for (let index = 0; index < content.length; index += 1) {
        const character = content[index];

        if (inQuotes) {
          if (character === '"' && content[index + 1] === '"') {
            field += '"';
            index += 1;
          } else if (character === '"') {
            inQuotes = false;
          } else {
            field += character;
          }
        } else if (character === '"' && field.length === 0) {
          inQuotes = true;
        } else if (character === ",") {
          row.push(field);
          field = "";
        } else if (character === "\n" || character === "\r") {
          row.push(field);
          if (row.some((cell) => cell.length > 0)) {
            rows.push(row);
          }
          row = [];
          field = "";
          if (character === "\r" && content[index + 1] === "\n") {
            index += 1;
          }
        } else {
          field += character;
        }
      }

      if (inQuotes) {
        throw new Error("The CSV has an unfinished quoted field.");
      }

      row.push(field);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      return rows;
    }

    function makeCell(tagName, value) {
      const cell = document.createElement(tagName);
      cell.textContent = value;
      return cell;
    }

    function renderPreview(rows) {
      const headers = rows[0];
      const dataRows = rows.slice(1);
      const columnCount = dataRows.reduce(
        (count, row) => Math.max(count, row.length),
        headers.length
      );
      const tableHeaders = Array.from({ length: columnCount }, (_, index) =>
        headers[index]?.trim() || `Column ${index + 1}`
      );

      previewHead.replaceChildren();
      previewBody.replaceChildren();
      copyStatus.textContent = "";

      const headerRow = document.createElement("tr");
      tableHeaders.forEach((header) => headerRow.append(makeCell("th", header)));
      headerRow.append(makeCell("th", "Action"));
      previewHead.append(headerRow);

      dataRows.slice(0, previewLimit).forEach((row, rowIndex) => {
        const tableRow = document.createElement("tr");
        tableHeaders.forEach((_, index) => {
          tableRow.append(makeCell("td", row[index] ?? ""));
        });

        const actionCell = document.createElement("td");
        actionCell.className = "row-action-cell";
        const copyButton = document.createElement("button");
        copyButton.className = "copy-row-button";
        copyButton.type = "button";
        copyButton.textContent = "Copy";
        copyButton.setAttribute("aria-label", `Copy row ${rowIndex + 1}`);
        copyButton.addEventListener("click", async () => {
          const rowText = tableHeaders.map((_, index) => row[index] ?? "").join("\t");
          try {
            await navigator.clipboard.writeText(rowText);
            copyStatus.textContent = `Row ${rowIndex + 1} copied to clipboard.`;
          } catch {
            copyStatus.textContent =
              "Could not copy this row. Check clipboard permissions and try again.";
          }
        });
        actionCell.append(copyButton);
        tableRow.append(actionCell);
        previewBody.append(tableRow);
      });

      previewSummary.textContent =
        `${dataRows.length.toLocaleString()} rows · ${columnCount.toLocaleString()} columns`;
      previewNote.textContent = dataRows.length > previewLimit
        ? `Showing the first ${previewLimit} rows.`
        : "Showing all rows.";
      preview.hidden = false;
    }

    fileInput.addEventListener("change", () => {
      preview.hidden = true;
      copyStatus.textContent = "";
      fileStatus.textContent = fileInput.files.length
        ? `${fileInput.files[0].name} · ${(fileInput.files[0].size / 1024).toFixed(1)} KB`
        : "No file selected";
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const file = fileInput.files[0];

      if (!file) {
        fileStatus.textContent = "Choose a CSV datasheet first.";
        preview.hidden = true;
        return;
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        fileStatus.textContent = "Please choose a CSV file.";
        preview.hidden = true;
        return;
      }

      try {
        const rows = parseCsv(await file.text());
        if (rows.length === 0) {
          fileStatus.textContent = "This CSV file is empty.";
          preview.hidden = true;
          return;
        }
        renderPreview(rows);
        fileStatus.textContent = `Preview ready: ${file.name}`;
      } catch (error) {
        fileStatus.textContent = error instanceof Error
          ? error.message
          : "Could not read this CSV file.";
        preview.hidden = true;
      }
    });

    const predictionResult = document.querySelector("#prediction-result");

    pasteRowForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const pastedText = pastedRowInput.value.replace(/(?:\r\n|\n|\r)$/, "");

      if (!pastedText.trim()) {
        pasteStatus.textContent = "Paste a row before submitting.";
        pastedRowResult.hidden = true;
        return;
      }

      const values = pastedText.split("\t");
      const row = document.createElement("tr");
      values.forEach((value) => row.append(makeCell("td", value)));
      pastedRowPreview.replaceChildren(row);
      pastedRowResult.hidden = false;
      pasteStatus.textContent = `Row submitted with ${values.length} columns.`;

      // Ask the Python model for a prediction
      predictionResult.className = "prediction-result";
      predictionResult.textContent = "Predicting...";
      try {
        const response = await fetch("/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Prediction failed.");
        predictionResult.textContent =
          `${data.message} (confidence: ${(data.confidence * 100).toFixed(1)}%)`;
      } catch (error) {
        predictionResult.classList.add("is-error");
        predictionResult.textContent = error.message ||
          "Could not reach the Python server. Is app.py running?";
      }
    });

const aboutTabs = Array.from(document.querySelectorAll(".about-tab"));

    function selectAboutTab(selectedTab, moveFocus = false) {
      aboutTabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
      });

      if (moveFocus) {
        selectedTab.focus();
      }
    }

    aboutTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectAboutTab(tab));
      tab.addEventListener("keydown", (event) => {
        let nextIndex;
        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % aboutTabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + aboutTabs.length) % aboutTabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = aboutTabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        selectAboutTab(aboutTabs[nextIndex], true);
      });
    });
