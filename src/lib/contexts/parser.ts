import { createContext } from 'react';
import type { ItemParserInterface } from '@lib/types';

export const ParserContext = createContext<ItemParserInterface | null>(null);
ParserContext.displayName = 'ParserContext';
export const ParserProvider = ParserContext.Provider;
export const ParserConsumer = ParserContext.Consumer;
