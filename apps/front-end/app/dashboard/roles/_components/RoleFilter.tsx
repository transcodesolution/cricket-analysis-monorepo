
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CloseButton, Flex, Input } from '@mantine/core'
import React, { useRef } from 'react'
import {  IFilterParams, updateUrlParams } from '@/libs/utils/updateUrlParams'

export const RoleFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const search = searchParams.get('search');

  const handleApplyFilter = (filters: IFilterParams) => {
    const newSearchParams = updateUrlParams(filters)
    router.push(`${newSearchParams.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleApplyFilter({ 'search': searchInputRef.current?.value });
    }
  };

  return (
    <Flex align='center' justify='space-between'>
      <Input
        ref={searchInputRef}
        placeholder="Search Role"
        onKeyDown={handleKeyDown}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => {
              handleApplyFilter({ 'search': undefined });
              if (searchInputRef.current) {
                searchInputRef.current.value = ''
              }
            }}
            style={{ display: search ? undefined : 'none' }}
          />
        }
      />
    </Flex>
  )
}