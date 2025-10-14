export default class APIService {
  static async Run(body) {
    try {
      const scriptName = "run_scenario.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async CheckDataType(body) {
    try {
      const scriptName = "run_check_data_type.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async FetchAdaptationMeasures(body) {
    try {
      const scriptName = "run_fetch_measures.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async FetchMacroEconomicChartData(body) {
    try {
      const scriptName = "run_fetch_macro_chart_data.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async FetchCREDOutputData(body) {
    try {
      const scriptName = "run_fetch_cred_output.py";
      const response = await window.api.runPythonScript({
        scriptName,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async FetchReports() {
    try {
      const scriptName = "run_fetch_reports.py";
      const response = await window.api.runPythonScript({
        scriptName,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async Shutdown() {
    try {
      const response = await window.electron.send("shutdown");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async Minimize() {
    try {
      const response = await window.electron.send("minimize");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async Refresh() {
    try {
      const response = await window.electron.send("reload");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async AddToOutput(body) {
    try {
      const scriptName = "run_add_to_ouput.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async ExportReport(body) {
    try {
      const scriptName = "run_export_report.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async RemoveReport(body) {
    try {
      const scriptName = "run_remove_report.py";
      const response = await window.api.runPythonScript({
        scriptName,
        data: body,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
