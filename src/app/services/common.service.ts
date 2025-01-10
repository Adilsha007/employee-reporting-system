import { Injectable } from '@angular/core';
import { Employee, Header, Role } from '../models/employee';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  employeeList = new BehaviorSubject<Employee[]>([]);

  constructor() { }

  /**
   * function extract data from file input event
   * @param { File } file selected file
   * @return { void }
   */
  extractDataFromFileinput(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const stringifiedData: string = reader.result as string;
      const rows = stringifiedData.split('\n');
      const headers = rows[0].trim().split(',');

      const formattedData = rows.slice(1).map(row => {
        const rowData = row.trim().split(',');

        //creating emplyee data from each row
        const employeeData: Employee = {
          email: '',
          fullName: '',
          currentReporters: [],
          designatedReporters: [],
          role: Role.DEFAULT,
          isReported: false
        };

        return headers.reduce((acc, header, idx) => {
          const value = rowData[idx] || '';
          switch (header) {
            case Header.EMAIL:
              acc.email = value;
              break;
            case Header.NAME:
              acc.fullName = value;
              break;
            case Header.ROLE:
              acc.role = value as Role;
              acc.designatedReporters = this.getDesignatedReporter(acc.role);
              break;
            case Header.REPORTSTO:
              acc.currentReporters = value.split(';') as Role[];
              break;
          }

          return acc;
        }, employeeData)
      });

      this.employeeList.next(formattedData);
    }
  }

  /**
   * function to create designated reporter from employee role
   * @param { Role } role role of employee
   * @return { Role[] } employee level based on role
   */
  getDesignatedReporter(role: Role): Role[] {
    switch (role) {
      case Role.ROOT: return [];
      case Role.ADMIN: return [Role.ROOT];
      case Role.MANAGER: return [Role.ADMIN, Role.MANAGER];
      case Role.CALLER: return [Role.MANAGER];
      default: return []
    }
  }
}
