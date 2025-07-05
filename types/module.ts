// Re-export all module types from the unified models file
import { OrderDirection } from './enums';
import type {
  CourseModule,
  ModuleQueryParams,
  CreateModuleDto,
  UpdateModuleDto
} from './models';

// Export enums
export { OrderDirection };

// Define ModuleOrderBy enum here since it's specific to the module page
export enum ModuleOrderBy {
  TITLE = 'title',
  ORDER = 'order',
  CREATED_AT = 'createdAt',
}

// Export types
export type {
  CourseModule as Module,
  ModuleQueryParams,
  CreateModuleDto,
  UpdateModuleDto
};

// For backward compatibility
export type ModuleList = CourseModule;

