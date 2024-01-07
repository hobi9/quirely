import { Card } from '@/components/ui/card';
import logo from '../../assets/logo.svg';
import { useState } from 'react';
import SelectWorkspaceStep from './SelectWorkspaceStep';
import CreateWorkspaceStep from './CreateWorkspaceStep';
import InviteToWorkspaceStep from './InviteToWorkspaceStep';

const SelectWorkspacePage = () => {
  const [step, setStep] = useState<'select' | 'create' | 'invite'>('select');

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-2">
      <Card className="w-full max-w-[450px]">
        <div className="ml-4 mt-4 inline-flex items-center gap-1 transition hover:opacity-75">
          <img src={logo} alt="logo" className="size-5" />
          <span className="font-logo text-xl">Quirely</span>
        </div>

        {step === 'select' && (
          <SelectWorkspaceStep showNextStep={() => setStep('create')} />
        )}

        {step === 'create' && (
          <CreateWorkspaceStep
            showNextStep={() => setStep('invite')}
            showInitialStep={() => setStep('select')}
          />
        )}

        {step === 'invite' && (
          <InviteToWorkspaceStep showInitialStep={() => setStep('select')} />
        )}
      </Card>
    </div>
  );
};

export default SelectWorkspacePage;
