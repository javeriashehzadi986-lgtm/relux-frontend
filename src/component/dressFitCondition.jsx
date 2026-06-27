import React from "react";
import { Button } from "@/components/ui/button";
import {
  LISTING_CONDITION_OPTIONS,
  LISTING_SIZE_OPTIONS,
} from "@/data/listingSpecs";
import "./dressFitCondition.css";

export function DressFitConditionSection({
  dress,
  selectedSize,
  onSizeChange,
  allowSizeSelect = true,
  onSizeGuideClick,
}) {
  const listingSize = dress.listingSize ?? "M";
  const listingCondition = dress.listingCondition ?? "Like New";
  const activeSize = selectedSize ?? listingSize;

  return (
    <section className="dress-fit-condition">
      <h3 className="dress-fit-condition-title">Fit &amp; Condition</h3>

      <div className="dress-fit-condition-block">
        <div className="dress-fit-condition-label-row">
          <p className="dress-fit-condition-label">Size</p>
          {onSizeGuideClick ? (
            <button
              type="button"
              className="dress-fit-condition-size-guide"
              onClick={onSizeGuideClick}
            >
              Size Guide
            </button>
          ) : null}
        </div>
        <div className="dress-fit-condition-chips">
          {LISTING_SIZE_OPTIONS.map((size) => {
            const isListed = size === listingSize;
            const isActive = size === activeSize;
            const isDisabled = !isListed;

            return (
              <Button
                key={size}
                type="button"
                variant="outline"
                className={`dress-fit-condition-chip ${
                  isActive ? "is-active" : ""
                } ${isDisabled ? "is-disabled" : ""}`}
                disabled={isDisabled || !allowSizeSelect}
                aria-pressed={isActive}
                aria-disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled && allowSizeSelect) onSizeChange?.(size);
                }}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="dress-fit-condition-block">
        <p className="dress-fit-condition-label">Condition</p>
        <div className="dress-fit-condition-chips">
          {LISTING_CONDITION_OPTIONS.map((condition) => (
            <Button
              key={condition}
              type="button"
              variant="outline"
              className={`dress-fit-condition-chip ${
                condition === listingCondition ? "is-active" : ""
              } is-readonly`}
              disabled
              aria-pressed={condition === listingCondition}
            >
              {condition}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
