import type { CLIModule, CommandContext, CommandResult } from '../types';
import { packageCommands } from '../package';

export const packageModule: CLIModule = {
  name: 'package',
  version: '1.0.0',
  
  commands: [
    {
      name: 'uploadIpa',
      description: 'Upload IPA file',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Uploading IPA file:', context.args[0]);
          await packageCommands.uploadIpa(context);
          return {
            success: true,
            data: { message: 'IPA uploaded successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload IPA failed'
          };
        }
      }
    },
    {
      name: 'uploadApk',
      description: 'Upload APK file',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Uploading APK file:', context.args[0]);
          await packageCommands.uploadApk(context);
          return {
            success: true,
            data: { message: 'APK uploaded successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload APK failed'
          };
        }
      }
    },
    {
      name: 'uploadApp',
      description: 'Upload APP file',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Uploading APP file:', context.args[0]);
          await packageCommands.uploadApp(context);
          return {
            success: true,
            data: { message: 'APP uploaded successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload APP failed'
          };
        }
      }
    },
    {
      name: 'parseApp',
      description: 'Parse APP file information',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Parsing APP file:', context.args[0]);
          await packageCommands.parseApp(context);
          return {
            success: true,
            data: { message: 'APP file parsed successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Parse APP failed'
          };
        }
      }
    },
    {
      name: 'parseIpa',
      description: 'Parse IPA file information',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Parsing IPA file:', context.args[0]);
          await packageCommands.parseIpa(context);
          return {
            success: true,
            data: { message: 'IPA file parsed successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Parse IPA failed'
          };
        }
      }
    },
    {
      name: 'parseApk',
      description: 'Parse APK file information',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          console.log('Parsing APK file:', context.args[0]);
          await packageCommands.parseApk(context);
          return {
            success: true,
            data: { message: 'APK file parsed successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Parse APK failed'
          };
        }
      }
    },
    {
      name: 'packages',
      description: 'List packages',
      handler: async (context: CommandContext): Promise<CommandResult> => {
        try {
          if (!context.options.platform) {
            throw new Error('Platform option is required');
          }
          console.log('Listing packages for platform:', context.options.platform);
          await packageCommands.packages({ options: { platform: context.options.platform } });
          return {
            success: true,
            data: { message: 'Packages listed successfully' }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'List packages failed'
          };
        }
      },
      options: {
        platform: { hasValue: true, description: 'Target platform' }
      }
    }
  ],

  workflows: []
}; 