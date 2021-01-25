import React from 'react';


export interface SelectedInventoryItemProps {
  selectedItem: string;
}
export default function SelectedInventoryItem({
  selectedItem,
}: SelectedInventoryItemProps): JSX.Element {
  return (
    <div>
      선택된 아이템:
      {' '}
      {selectedItem}
    </div>
  );
}
