"""
Application entrypoint for processing messages and executing scripts.

This module serves as the entrypoint for the application, responsible for processing incoming 
messages, determining the appropriate script to execute based on the message content, and 
executing the corresponding script.

Functions:

- process_message(message): 
    Processes the incoming message, determines the script to execute, and executes the script.
- main(): 
    Main function of the application that continuously listens for incoming messages,
    processes them, and sends back the response.
"""

import json
import sys

from run_add_to_ouput import RunAddToOutput
from run_check_data_type import RunCheckDataType
from run_clear_temp_dir import RunClearTempDir
from run_export_report import RunExportReport
from run_fetch_cred_output import RunFetchCredOutput
from run_fetch_macro_chart_data import RunFetchMacroChartData
from run_fetch_measures import RunFetchScenario
from run_fetch_reports import RunFetchReports
from run_remove_report import RunRemoveReport
from run_scenario import RunScenario


def process_message(message):
    """
    Process a message and execute the corresponding script.

    This function processes a message containing information about a script to be executed
    along with optional data. Based on the script name provided in the message, it creates
    an instance of the corresponding runner class and executes the script. It then returns
    a response indicating whether the execution was successful along with any results.

    :param message: The message containing information about the script and optional data.
    :type message: dict
    :return: A response indicating the success or failure of the script execution and any results.
    :rtype: dict
    """
    script_name = message.get("scriptName", "")
    data = message.get("data", None)

    if script_name == "run_scenario.py":
        runner = RunScenario(data)
        result = runner.run_scenario()
        response = {"success": True, "result": result}
    elif script_name == "run_check_data_type.py":
        runner = RunCheckDataType(data)
        result = runner.run_check_data_type()
        response = {"success": True, "result": result}
    elif script_name == "run_fetch_measures.py":
        runner = RunFetchScenario(data)
        result = runner.run_fetch_measures()
        response = {"success": True, "result": result}
    elif script_name == "run_clear_temp_dir.py":
        runner = RunClearTempDir()
        result = runner.run_clear_temp_dir()
        response = {"success": True, "result": result}
    elif script_name == "run_add_to_ouput.py":
        runner = RunAddToOutput(data)
        result = runner.run_add_to_output()
        response = {"success": True, "result": result}
    elif script_name == "run_remove_report.py":
        runner = RunRemoveReport(data)
        result = runner.run_remove_report()
        response = {"success": True, "result": result}
    elif script_name == "run_fetch_reports.py":
        runner = RunFetchReports()
        result = runner.run_fetch_reports()
        response = {"success": True, "result": result}
    elif script_name == "run_export_report.py":
        runner = RunExportReport(data)
        result = runner.run_export_report()
        response = {"success": True, "result": result}
    elif script_name == "run_fetch_macro_chart_data.py":
        runner = RunFetchMacroChartData(data)
        result = runner.run_fetch_macro_chart_data()
        response = {"success": True, "result": result}
    elif script_name == "run_fetch_cred_output.py":
        runner = RunFetchCredOutput()
        result = runner.run_fetch_cred_output()
        response = {"success": True, "result": result}
    else:
        response = {"success": False, "error": f"Unknown script: {script_name}"}

    return response


def main():
    """
    Main function for interacting with the Node.js process.

    This function sends a 'ready' event to the Node.js process upon initialization.
    It then enters a loop where it continuously reads messages from stdin, processes
    each message using the process_message function, and sends the response back through
    stdout as a JSON string.

    """
    # Send the 'ready' event to the Node.js process
    ready_event = {"type": "event", "name": "ready"}
    print(json.dumps(ready_event))
    sys.stdout.flush()

    while True:
        raw_message = sys.stdin.readline().strip()

        if raw_message:
            message = json.loads(raw_message)
            response = process_message(message)
            # Send the response back through stdout as a JSON string
            sys.stdout.write(json.dumps(response) + "\n")
            sys.stdout.flush()


# Add this condition to ensure the infinite loop is only executed when app.py
# is run as the main script
if __name__ == "__main__":
    main()
