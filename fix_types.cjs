const fs = require('fs');

const files = [
    'resources/js/Components/DangerButton.tsx',
    'resources/js/Components/Dropdown.tsx',
    'resources/js/Components/Modal.tsx',
    'resources/js/Components/NavLink.tsx',
    'resources/js/Components/ResponsiveNavLink.tsx',
    'resources/js/Components/SecondaryButton.tsx',
    'resources/js/Components/TextInput.tsx',
    'resources/js/Layouts/AuthenticatedLayout.tsx',
    'resources/js/Pages/Admin/Staff/Index.tsx',
    'resources/js/Pages/Auth/ConfirmPassword.tsx',
    'resources/js/Pages/Auth/ForgotPassword.tsx',
    'resources/js/Pages/Auth/Register.tsx',
    'resources/js/Pages/Auth/ResetPassword.tsx',
    'resources/js/Pages/Auth/VerifyEmail.tsx',
    'resources/js/Pages/Profile/Edit.tsx',
    'resources/js/Pages/Profile/Partials/DeleteUserForm.tsx',
    'resources/js/Pages/Profile/Partials/UpdatePasswordForm.tsx',
    'resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.tsx',
    'resources/js/Pages/Welcome.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Fix implicit any on event handlers
    content = content.replace(/\(e\) =>/g, '(e: any) =>');
    
    // Fix useRef() without types
    content = content.replace(/useRef\(\)/g, 'useRef<any>()');

    // Fix specific props
    content = content.replace(/export default function Welcome\({ auth }\) {/g, 'export default function Welcome({ auth }: any) {');
    content = content.replace(/export default function Edit\({ mustVerifyEmail, status }\) {/g, 'export default function Edit({ mustVerifyEmail, status }: any) {');
    content = content.replace(/export default function UpdateProfileInformation\({/g, 'export default function UpdateProfileInformation({');
    content = content.replace(/mustVerifyEmail,\n    status,\n    className = '',\n}\) {/g, 'mustVerifyEmail, status, className = \'\' }: any) {');

    // Fix Dropdown
    content = content.replace(/const Dropdown = \({ children }\) => {/g, 'const Dropdown = ({ children }: any) => {');
    content = content.replace(/const Trigger = \({ children }\) => {/g, 'const Trigger = ({ children }: any) => {');
    content = content.replace(/const Content = \({/g, 'const Content = ({');
    content = content.replace(/contentClasses = 'py-1\.5 bg-white',\n    children,\n}\) => {/g, 'contentClasses = \'py-1.5 bg-white\', children }: any) => {');
    content = content.replace(/const DropdownLink = \({ className = '', children, \.\.\.props }\) => {/g, 'const DropdownLink = ({ className = \'\', children, ...props }: any) => {');

    // Fix Modal
    content = content.replace(/export default function Modal\({/g, 'export default function Modal({');
    content = content.replace(/onClose = \(\) => \{\},\n}\) {/g, 'onClose = () => {} }: any) {');

    // Fix Buttons
    content = content.replace(/export default function SecondaryButton\({/g, 'export default function SecondaryButton({');
    content = content.replace(/children,\n    \.\.\.props\n}\) {/g, 'children, ...props }: any) {');

    content = content.replace(/export default function DangerButton\({/g, 'export default function DangerButton({');
    content = content.replace(/children,\n    \.\.\.props\n}\) {/g, 'children, ...props }: any) {');

    // Fix NavLinks
    content = content.replace(/export default function NavLink\({/g, 'export default function NavLink({');
    content = content.replace(/export default function ResponsiveNavLink\({/g, 'export default function ResponsiveNavLink({');

    // Auth forms
    content = content.replace(/export default function ForgotPassword\({ status }\) {/g, 'export default function ForgotPassword({ status }: any) {');
    content = content.replace(/export default function VerifyEmail\({ status }\) {/g, 'export default function VerifyEmail({ status }: any) {');
    content = content.replace(/export default function ResetPassword\({ token, email }\) {/g, 'export default function ResetPassword({ token, email }: any) {');

    // Layout
    content = content.replace(/export default function AuthenticatedLayout\({ header, children }\) {/g, 'export default function AuthenticatedLayout({ header, children }: any) {');

    // Profile Partials
    content = content.replace(/export default function UpdatePasswordForm\({ className = '' }\) {/g, 'export default function UpdatePasswordForm({ className = \'\' }: any) {');
    content = content.replace(/export default function DeleteUserForm\({ className = '' }\) {/g, 'export default function DeleteUserForm({ className = \'\' }: any) {');

    fs.writeFileSync(file, content);
});
