import { SALES_OPTIONS_TYPES } from '../../biller/constants/fields';
import { BillerResponse } from '../../biller/models/biller';
import { DetailDialogData } from '../../core/models/global';
import { formatCurrency, formatDate } from '../../core/utils/formatters';

export class SaleDetailMapper {
  static toDetailDialogData(sale: BillerResponse): DetailDialogData {
    return {
      title: `Detalle de venta #${sale.id}`,
      sections: [
        {
          title: 'Información general',
          fields: [
            { label: 'Fecha de venta', value: formatDate(sale.sale_date) },
            { label: 'Tipo de venta', value: this.getSaleTypeLabel(sale.sale_type) },
            { label: 'Cuenta bancaria', value: sale.account?.name ?? 'Pendiente de pago' },
            { label: 'Fecha de pago', value: formatDate(sale.payment_date) },
          ],
        },
        {
          title: 'Información cliente',
          fields: [
            { label: 'Cliente', value: sale.client.name },
            { label: 'DNI', value: sale.client.dni },
            { label: 'RUC', value: sale.client.ruc },
            { label: 'Teléfono', value: sale.client.phone },
          ],
        },
        {
          title: 'Importes',
          fields: [
            { label: 'Subtotal', value: formatCurrency(sale.subtotal) },
            {
              label: 'Porcentaje IGV',
              value: sale.igv_percentage === null ? 'Exonerada' : `${sale.igv_percentage}%`,
            },
            { label: 'IGV', value: formatCurrency(sale.igv) },
            { label: 'Total', value: formatCurrency(sale.total) },
          ],
        },
      ],
      tables: [
        {
          title: 'Productos',
          columns: [
            { key: 'product', label: 'Producto' },
            { key: 'brand', label: 'Marca' },
            { key: 'measureUnity', label: 'U.M.' },
            { key: 'quantity', label: 'Cantidad' },
            { key: 'unitPrice', label: 'Precio unitario' },
            { key: 'subtotal', label: 'Subtotal' },
          ],
          rows: sale.items.map((item) => ({
            product: item.product.description,
            brand: item.product.brand,
            measureUnity: item.product.measure_unity,
            quantity: item.quantity,
            unitPrice: formatCurrency(item.unit_price),
            subtotal: formatCurrency(item.subtotal),
          })),
        },
        {
          title: 'Movimientos de cuenta',
          columns: [
            { key: 'date', label: 'Fecha' },
            { key: 'account', label: 'Cuenta' },
            { key: 'type', label: 'Tipo' },
            { key: 'status', label: 'Estado' },
            { key: 'description', label: 'Descripción' },
            { key: 'amount', label: 'Monto' },
          ],
          rows: sale.account_movements.map((movement) => ({
            date: formatDate(movement.movement_date),
            account: movement.account?.name ?? 'Pendiente de pago',
            type: movement.type,
            status: movement.status,
            description: movement.description,
            amount: formatCurrency(movement.amount),
          })),
        },
      ],
    };
  }

  private static getSaleTypeLabel(value: string): string {
    return SALES_OPTIONS_TYPES.find((type) => type.value === value)?.label ?? value;
  }
}
