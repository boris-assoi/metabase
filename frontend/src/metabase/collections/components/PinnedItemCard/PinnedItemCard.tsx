import type { Dispatch, MouseEvent, SetStateAction } from "react";
import { useState } from "react";
import { t } from "ttag";

import ActionMenu from "metabase/collections/components/ActionMenu";
import type {
  CreateBookmark,
  DeleteBookmark,
} from "metabase/collections/types";
import Tooltip from "metabase/core/components/Tooltip";
import ModelDetailLink from "metabase/models/components/ModelDetailLink";
import type { IconName } from "metabase/ui";
import type Database from "metabase-lib/v1/metadata/Database";
import type { Bookmark, Collection, CollectionItem } from "metabase-types/api";

import {
  ActionsContainer,
  Body,
  Description,
  Header,
  ItemCard,
  ItemIcon,
  ItemLink,
  Title,
} from "./PinnedItemCard.styled";

type Props = {
  databases?: Database[];
  bookmarks?: Bookmark[];
  createBookmark: CreateBookmark;
  deleteBookmark: DeleteBookmark;
  className?: string;
  item: CollectionItem;
  collection: Collection;
  onCopy: (items: CollectionItem[]) => void;
  onMove: (items: CollectionItem[]) => void;
};

const TOOLTIP_MAX_WIDTH = 450;

const DEFAULT_DESCRIPTION: Record<string, string> = {
  card: t`A question`,
  dashboard: t`A dashboard`,
  dataset: t`A model`,
};

function PinnedItemCard({
  databases,
  bookmarks,
  createBookmark,
  deleteBookmark,
  className,
  item,
  collection,
  onCopy,
  onMove,
}: Props) {
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const icon = item.getIcon().name;
  const { description, name, model } = item;
  const defaultedDescription = description || DEFAULT_DESCRIPTION[model] || "";

  const maybeEnableTooltip = (
    event: MouseEvent<HTMLDivElement>,
    setterFn: Dispatch<SetStateAction<boolean>>,
  ) => {
    const target = event.target as HTMLDivElement;
    const isTargetElWiderThanCard = target?.scrollWidth > target?.clientWidth;
    if (isTargetElWiderThanCard) {
      setterFn(true);
    }
  };

  return (
    <ItemLink className={className} to={item.getUrl()}>
      <ItemCard flat>
        <Body>
          <Header>
            <ItemIcon name={icon as unknown as IconName} />
            <ActionsContainer>
              {item.model === "dataset" && <ModelDetailLink model={item} />}
              <ActionMenu
                databases={databases}
                bookmarks={bookmarks}
                createBookmark={createBookmark}
                deleteBookmark={deleteBookmark}
                item={item}
                collection={collection}
                onCopy={onCopy}
                onMove={onMove}
              />
            </ActionsContainer>
          </Header>
          <Tooltip
            tooltip={name}
            placement="bottom"
            maxWidth={TOOLTIP_MAX_WIDTH}
            isEnabled={showTitleTooltip}
          >
            <Title
              onMouseEnter={e => maybeEnableTooltip(e, setShowTitleTooltip)}
            >
              {name}
            </Title>
          </Tooltip>

          <Description tooltipMaxWidth={TOOLTIP_MAX_WIDTH}>
            {defaultedDescription}
          </Description>
        </Body>
      </ItemCard>
    </ItemLink>
  );
}

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default PinnedItemCard;
