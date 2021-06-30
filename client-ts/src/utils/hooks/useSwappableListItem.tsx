import { useState } from 'react';
import * as React from 'react';

export interface SwapableListItemResult<T> {
  items: T[];
  handleChange: (
    idx: number,
    key: keyof T,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addItem: (item: T) => void;
  removeItem: (targetIdx: number) => void;
  upItemPosition: (targetIdx: number) => void;
  downItemPosition: (targetIdx: number) => void;
  handleReset: () => void;
  checkItemsEmpty: () => void;
}
export default function useSwapableListItem<T = any>(
  defaultValue: T[] = [],
): SwapableListItemResult<T> {
  const [items, setItems] = useState<T[]>(defaultValue);

  /**
   * 배열중 타겟 객체{idx}의 {key} 요소에 대한 입력을 핸들링하는 함수.
   * @param idx 입력 핸들링을 진행할 배열 인덱스
   * @param key 입력 핸들링을 진행할 객체의 필드
   * @returns {void}
   * @author hwasurr
   */
  const handleChange =
    (idx: number, key: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      e.persist(); // Because of event pooling by React
      // This is documentations of event pooling
      // React SyntheticEvent => https://ko.reactjs.org/docs/events.html
      // React Event Pooling https://ko.reactjs.org/docs/legacy-event-pooling.html
      setItems(prev => {
        const tmp = [...prev];
        const changed = { ...tmp[idx], [key]: e.target.value };
        tmp[idx] = changed;
        return tmp;
      });
    };

  /**
   * 목록에 아이템을 추가합니다
   * @param item 추가할 Item
   */
  function addItem(item: T): void {
    setItems(prev => prev.concat(item));
  }

  /**
   * 목록에서 아이템을 삭제합니다.
   * @param targetIdx 삭제할 목표의 인덱스
   */
  function removeItem(targetIdx: number): void {
    setItems(prev => prev.filter((_, idx) => idx !== targetIdx));
  }

  /**
   * 목록에서 해당 아이템의 순서를 위로 올립니다.
   * @param targetIdx 위치를 위로 올릴 목표 아이템의 인덱스
   */
  function upItemPosition(targetIdx: number): void {
    const tmp = [...items];
    const target = tmp[targetIdx];
    tmp[targetIdx] = tmp[targetIdx - 1];
    tmp[targetIdx - 1] = target;

    setItems(tmp);
  }

  /**
   * 목록에서 해당 아이템의 순서를 아래로 내립니다.
   * @param targetIdx 위치를 아래로 내릴 목표 아이템의 인덱스
   */
  function downItemPosition(targetIdx: number): void {
    const tmp = [...items];
    const target = tmp[targetIdx];
    tmp[targetIdx] = tmp[targetIdx + 1];
    tmp[targetIdx + 1] = target;
    setItems(tmp);
  }

  /**
   * 목록을 기본값으로 리셋합니다.
   */
  function handleReset(): void {
    setItems(defaultValue);
  }

  /**
   * 배열안의 객체의 각 필드값이 비었는지 확인합니다. 빈 필드가 하나라도 있으면 true를 반환합니다.
   * @returns {boolean}
   */
  function checkItemsEmpty(): boolean {
    const filtered = items.filter(item => {
      let isEmpty = false;
      Object.keys(item).forEach(key => {
        if (!item[key as keyof T]) isEmpty = true;
      });
      if (isEmpty) return false;
      return true;
    });
    // 각 필드값이 비었는 지 필터링한 목록이 기본 목록과 같은 경우
    // 즉 문제 없는 경우 false
    if (filtered.length === items.length) return false;
    return true;
  }

  return {
    items,
    handleChange,
    addItem,
    removeItem,
    upItemPosition,
    downItemPosition,
    handleReset,
    checkItemsEmpty,
  };
}
