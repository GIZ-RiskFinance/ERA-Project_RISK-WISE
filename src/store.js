import { create } from "zustand";

import { generateRunCode } from "./utils/misc";

const useStore = create((set, get) => ({
  activeMap: "hazard",
  activeMapRef: null,
  activeViewControl: "display_map",
  available_macro_sectors: [],
  alertMessage: "",
  alertSeverity: "info",
  alertShowMessage: false,
  credOutputData: [],
  isPlotMacroChartCompleted: false,
  isPlotMacroChartRunning: false,
  isScenarioRunCompleted: false,
  isScenarioRunning: false,
  isValidExposureEconomic: false,
  isValidExposureNonEconomic: false,
  isValidHazard: false,
  mapTitle: "",
  macroEconomicChartData: {},
  macroEconomicChartTitle: "",
  modalMessage: "",
  progress: 0,
  reports: [],
  scenarioRunCode: "",
  selectedAnnualGrowth: 0,
  selectedAppOption: "",
  selectedCard: "country",
  selectedCountry: "",
  selectedExposureEconomic: "",
  selectedExposureFile: "",
  selectedExposureNonEconomic: "",
  selectedHazard: "",
  selectedHazardFile: "",
  selectedMacroCard: "country",
  selectedMacroCountry: "",
  selectedMacroScenario: "",
  selectedMacroSector: "",
  selectedMacroVariable: "",
  selectedReport: null,
  selectedReportType: "",
  selectedScenario: "",
  selectedScenarioRunCode: "",
  selectedSubTab: 0,
  selectedTab: 0,
  selectedTimeHorizon: [2024, 2050],

  // Method to add a new report
  addReport: (newReport) => {
    const { reports } = get();
    // Check if the report already exists
    const reportExists = reports.some((r) => r.id === newReport.id);
    if (!reportExists) {
      set((state) => ({
        reports: [...state.reports, newReport],
      }));
    }
  },

  // Method to remove a report by id
  removeReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== reportId),
    })),

  // Method to update reports
  updateReports: (newReports) =>
    set(() => ({
      reports: newReports,
    })),

  setActiveMap: (map) => set({ activeMap: map }),
  setActiveMapRef: (mapRef) => set({ activeMapRef: mapRef }),
  setAlertMessage: (message) => set({ alertMessage: message }),
  setAlertSeverity: (severity) => set({ alertSeverity: severity }),
  setAlertShowMessage: (show) => set({ alertShowMessage: show }),
  setCredOutputData: (data) => set({ credOutputData: data }),
  setIsPlotMacroChartCompleted: (data) => set({ isPlotMacroChartCompleted: data }),
  setIsPlotMacroChartRunning: (data) => set({ isPlotMacroChartRunning: data }),
  setIsScenarioRunCompleted: (data) => set({ isScenarioRunCompleted: data }),
  setIsScenarioRunning: (data) => set({ isScenarioRunning: data }),
  setIsValidExposureEconomic: (isValid = null) => {
    const { selectedAppOption } = get();
    if (selectedAppOption === "era") {
      set({ isValidExposureEconomic: true });
    } else {
      set({ isValidExposureEconomic: isValid });
    }
  },
  setIsValidExposureNonEconomic: (isValid = null) => {
    const { selectedAppOption } = get();
    if (selectedAppOption === "era") {
      set({ isValidExposureNonEconomic: true });
    } else {
      set({ isValidExposureNonEconomic: isValid });
    }
  },
  setIsValidHazard: (isValid = null) => {
    const { selectedAppOption } = get();
    if (selectedAppOption === "era") {
      set({ isValidHazard: true });
    } else {
      set({ isValidHazard: isValid });
    }
  },
  setMapTitle: (data) => set({ mapTitle: data }),
  setMacroEconomicChartData: (data) => set({ macroEconomicChartData: data }),
  setMacroEconomicChartTitle: (title) => set({ macroEconomicChartTitle: title }),
  setModalMessage: (message) => set({ modalMessage: message }),
  setProgress: (newProgress) => set({ progress: newProgress }),
  setReports: (reports) => set({ reports }),
  setScenarioRunCode: (code = null) => {
    set({ scenarioRunCode: code || generateRunCode() });
  },
  setSelectedAnnualGrowth: (annualGrowth) => set({ selectedAnnualGrowth: annualGrowth }),
  setSelectedAppOption: (option) => set({ selectedAppOption: option }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  setSelectedCountry: (country) => {
    set({
      selectedCountry: country,
      selectedAnnualGrowth: 0,
      selectedExposureEconomic: "",
      selectedExposureFile: "",
      selectedExposureNonEconomic: "",
      selectedHazard: "",
      selectedHazardFile: "",
      selectedScenario: "",
      selectedTimeHorizon: [2024, 2050],
      isValidExposureEconomic: false,
      isValidExposureNonEconomic: false,
      isValidHazard: false,
      mapTitle: "",
      isScenarioRunCompleted: false,
    });
  },
  setSelectedMacroCard: (card) => set({ selectedMacroCard: card }),
  setSelectedMacroCountry: (country) => {
    set({
      selectedMacroCountry: country,
      selectedMacroScenario: "",
      selectedMacroSector: "",
      selectedMacroVariable: "",
    });
  },
  setSelectedExposureEconomic: (exposureEconomic) => {
    set({ selectedExposureEconomic: exposureEconomic, selectedAnnualGrowth: 0 });
  },
  setSelectedExposureNonEconomic: (exposureNonEconomic) => {
    set({ selectedExposureNonEconomic: exposureNonEconomic, selectedAnnualGrowth: 0 });
  },
  setSelectedHazard: (hazard) => {
    set({
      selectedAnnualGrowth: 0,
      selectedExposureEconomic: "",
      selectedExposureFile: "",
      selectedExposureNonEconomic: "",
      selectedHazard: hazard,
      selectedScenario: "",
      selectedTimeHorizon: [2024, 2050],
      isValidExposureEconomic: false,
      isValidExposureNonEconomic: false,
      mapTitle: "",
      isScenarioRunCompleted: false,
    });
  },
  setSelectedMacroScenario: (scenario) =>
    set({
      selectedMacroScenario: scenario,
      selectedMacroVariable: "",
      selectedMacroSector: "",
    }),
  setSelectedMacroSector: (sector) => set({ selectedMacroSector: sector }),
  setSelectedMacroVariable: (variable) =>
    set({
      selectedMacroVariable: variable,
      selectedMacroSector: "",
    }),
  setSelectedExposureFile: (exposureFile) => set({ selectedExposureFile: exposureFile }),
  setSelectedHazardFile: (hazardFile) => set({ selectedHazardFile: hazardFile }),
  setSelectedReportType: (reportType) => set({ selectedReportType: reportType }),
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  setSelectedScenarioRunCode: (code) => set({ selectedScenarioRunCode: code }),
  setSelectedSubTab: (subTab) => set({ selectedSubTab: subTab }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setSelectedTab: (tab) => {
    let viewControl = "";
    if (tab === 1) {
      viewControl = "display_map";
    } else if (tab === 2) {
      viewControl = "display_macro_parameters";
    }

    set({
      selectedTab: tab,
      selectedSubTab: 0,
      activeViewControl: viewControl,
    });
  },

  setSelectedTimeHorizon: (timeHorizon) => set({ selectedTimeHorizon: timeHorizon }),
  setActiveViewControl: (control) => set({ activeViewControl: control }),
}));

export default useStore;
