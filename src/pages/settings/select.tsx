import * as React from 'react';
import cls from 'classnames';

type SettingsSelectProps = {
  items: Array<{ text: string; id: string }>;
  selectedId: string;
  onChange: (id: string) => void;
};

const SettingsSelect: React.FC<SettingsSelectProps> = ({
  items,
  onChange,
  selectedId,
}) => {
  const selectedItemRef = React.useRef<HTMLSpanElement>();

  const itemList = React.useMemo(() => {
    return items.map((item) => (
      <span
        key={item.id}
        ref={item.id === selectedId ? (selectedItemRef as any) : undefined}
        onClick={() => onChange(item.id)}
        className={cls('select-item', {
          selected: item.id === selectedId,
        })}
      >
        {item.text}
      </span>
    ));
  }, [items, selectedId, onChange]);

  React.useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    }
  }, []);

  return (
    <div className="settings-select">
      <div className="select-content">{itemList}</div>
    </div>
  );
};

export default SettingsSelect;
