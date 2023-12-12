# Office Hours Enhancement Macro

This is an example macro which enhances the current Office Hours feature on Webex Devices by immediately activating or deactivating standby at the start and end of the configured Office Hours.

This is useful in situations in which you have Automatic Standby disabled or your device is in Kiosk Mode and you would like it to full exit standby once Office Hours have started.

## Overview

The macro creates two scheduled actions which deactivate and activate standby mode. The scheduled times are based off the current Office Hours Work Week Days and the Work Day Start and End times configured on the Device so this macro actually has no configuration of its own.

If any of the Office Hours Times or Days settings are changed in the Devices configuration, the macro will cancel its current scheduled actions and create new recalculated scheduled actions.


## Setup

### Prerequisites & Dependencies: 

- Webex Device with RoomOS 10.7 or above
- Web admin access to the device to upload the macro


### Installation Steps:

1. Download the ``office-hours-enhancement.js`` file and upload it to your Webex Devices Macro editor via the web interface.
2. Enable the Macro on the editor.
3. Configure the Office Hours feature on your devices: https://help.webex.com/en-us/article/nge8zpq/

## Validation

Validated Hardware:

* Board 55
* Desk Pro

This macro should work on other Webex Devices but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).


## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer
 
Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=office-hours-enhancement-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
