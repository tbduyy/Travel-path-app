
"use client";

import { Lock, Unlock, Trash2 } from 'lucide-react';
import { toggleLockUser, deleteUser } from './actions';

type UserActionsProps = {
    user: {
        id: string;
        email: string;
        isLocked: boolean;
    }
}

export default function UserActions({ user }: UserActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            <form action={toggleLockUser}>
                <input type="hidden" name="email" value={user.email} />
                <input type="hidden" name="currentStatus" value={String(user.isLocked)} />
                <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-[#1B4D3E] transition-colors" title={user.isLocked ? "Mở khóa" : "Khóa tài khoản"}>
                    {user.isLocked ? <Unlock size={18} /> : <Lock size={18} />}
                </button>
            </form>

            <form action={deleteUser} onSubmit={(e) => { if (!confirm('Bạn có chắc chắn muốn xóa user này?')) e.preventDefault() }}>
                <input type="hidden" name="email" value={user.email} />
                <input type="hidden" name="id" value={user.id} />
                <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" title="Xóa tài khoản">
                    <Trash2 size={18} />
                </button>
            </form>
        </div>
    );
}
