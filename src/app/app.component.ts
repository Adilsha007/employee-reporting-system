import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
import { Employee, Role } from './models/employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employee-reporting-system';
  employeeList: Employee[] = [];

  constructor(private commonService: CommonService) { };

  ngOnInit() {
    this.commonService.employeeList.subscribe({
      next: (employeeData) => {
        if (employeeData.length > 0) {
          this.employeeList = this.markReportedEmployees(employeeData);
        }
      },
      error: (err) => console.error(err)
    })
  }

  /**
   * Function to handle file input change event
   * @param { Event } event event from html input
   * @return { void }
   */
  onFileSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
      const file = files.item(0) as File;
      this.commonService.extractDataFromFileinput(file);
    }
  }

  /**
   * function to employee's reporting status
   * @param { Employee[] } employeeData structured employee data
   * @return { Employee[] } updated employee data
   */
  markReportedEmployees(employeeData: Employee[]): Employee[] {
    return employeeData.map(data => {
      if (data.role === Role.ROOT) {
        data.isReported = true;
      } else {
        if (data.currentReporters.length === 1) {
          const reporter = employeeData.find(dt => dt.email === data.currentReporters[0]);
          if (reporter) {
            data.isReported = data.designatedReporters.includes(reporter.role);
          }
        }
      }
      return data;
    })
  }

  /**
   * function to show alert message
   * @param { Employee } employee selected employee details
   * @return { void }
   */
  showMessage(employee: Employee): void {
    let message = '';
    if (employee.currentReporters.length === 1) {
      const reporter = this.employeeList.find(emp => emp.email === employee.currentReporters[0]);
      message = `${employee.fullName}, a ${employee.role}, should reported to ${employee.designatedReporters} but is incorrectly reporting to the ${reporter?.role} (${reporter?.fullName})`;
    } else {
      message = `${employee.fullName}, a ${employee.role}, is incorrectly reporting to multiple people (${employee.currentReporters})`;
    }
    window.alert(message);
  }
}
