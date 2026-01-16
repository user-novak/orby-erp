import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { read, utils, WorkSheet } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelImportService {
  importExcel<T extends Record<string, unknown>>(file: File, sheetIndex = 0): Observable<T[]> {
    return from(this.readFile(file)).pipe(
      map((buffer) => {
        const workbook = read(buffer);

        const sheetName = workbook.SheetNames[sheetIndex];
        if (!sheetName) {
          throw new Error('La hoja indicada no existe');
        }

        const worksheet = workbook.Sheets[sheetName];
        return this.transformSheet<T>(worksheet);
      })
    );
  }

  private readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('No se pudo leer el archivo'));
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private transformSheet<T extends Record<string, unknown>>(worksheet: WorkSheet): T[] {
    return utils.sheet_to_json<T>(worksheet, {
      defval: null,
      raw: true,
    });
  }
}
