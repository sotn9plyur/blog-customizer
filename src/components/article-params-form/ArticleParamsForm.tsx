import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

import { ArrowButton } from '../../ui/arrow-button';
import { Button } from '../../ui/button';
import { RadioGroup } from '../../ui/radio-group';
import { Select } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Text } from '../../ui/text';

import {
  OptionType,
  ArticleStateType,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
} from '../../constants/articleProps';

type ArticleParamsFormProps = {
  onApply: (settings: ArticleStateType) => void;
};

const useOutsideClickHandler = (
  isOpen: boolean,
  ref: React.RefObject<HTMLElement>,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, ref, onClose]);
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ArticleStateType>(defaultArticleState);

  useOutsideClickHandler(isOpen, formRef, () => setIsOpen(false));

  const toggleForm = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleChange = useCallback(
    (field: keyof ArticleStateType) => (value: OptionType) => {
      setDraft(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setDraft(defaultArticleState);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onApply(draft);
    },
    [draft, onApply]
  );

  return (
    <>
      <ArrowButton onClick={toggleForm} isOpen={isOpen} />

      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <Text size={31} weight={800} uppercase as="h3" align="center">
            Задайте параметры
          </Text>

          <Select
            selected={draft.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={handleChange('fontFamilyOption')}
            title="Шрифт"
          />

          <RadioGroup
            name="fontSize"
            options={fontSizeOptions}
            selected={draft.fontSizeOption}
            onChange={handleChange('fontSizeOption')}
            title="Размер шрифта"
          />

          <Select
            selected={draft.fontColor}
            options={fontColors}
            onChange={handleChange('fontColor')}
            title="Цвет шрифта"
          />

          <Separator />

          <Select
            selected={draft.backgroundColor}
            options={backgroundColors}
            onChange={handleChange('backgroundColor')}
            title="Цвет фона"
          />

          <Select
            selected={draft.contentWidth}
            options={contentWidthArr}
            onChange={handleChange('contentWidth')}
            title="Ширина контента"
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" onClick={handleReset} />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
