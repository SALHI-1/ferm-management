<?php
$files = ['lang/en.json', 'lang/fr.json'];

$newKeysFr = [
    'admin_clients_list.app_layout_title' => 'Gestion des Clients',
    'admin_clients_list.head_title' => 'Clients',
    'admin_clients_list.section_title' => 'Liste des Clients',
    'admin_clients_list.add_button' => 'Nouveau Client',
    
    'admin_clients_list.table.full_name' => 'Nom Complet',
    'admin_clients_list.table.email' => 'Email',
    'admin_clients_list.table.phone' => 'Téléphone',
    'admin_clients_list.table.registration_date' => 'Date d\'inscription',
    'admin_clients_list.table.actions' => 'Actions',
    
    'admin_clients_list.farm_account' => 'Compte Ferme',
    'admin_clients_list.empty' => 'Aucun client enregistré pour le moment.',
    'admin_clients_list.delete_confirm' => 'Êtes-vous sûr de vouloir archiver ce client ? Il n\'aura plus accès à la plateforme.',
    
    'admin_clients_list.modal.add_title' => 'Ajouter un Client',
    'admin_clients_list.modal.edit_title' => 'Modifier le Client',
    'admin_clients_list.modal.first_name' => 'Prénom',
    'admin_clients_list.modal.last_name' => 'Nom',
    'admin_clients_list.modal.email' => 'Email',
    'admin_clients_list.modal.phone' => 'Téléphone',
    'admin_clients_list.modal.registration_date' => 'Date d\'inscription',
    
    'admin_clients_list.modal.password_section' => 'Mot de passe',
    'admin_clients_list.modal.password_info' => 'Laissez les champs vides si vous ne souhaitez pas modifier le mot de passe actuel.',
    'admin_clients_list.modal.new_password' => 'Nouveau mot de passe',
    'admin_clients_list.modal.password' => 'Mot de passe',
    'admin_clients_list.modal.confirm_password' => 'Confirmer le mot de passe',
    
    'admin_clients_list.modal.cancel' => 'Annuler',
    'admin_clients_list.modal.update' => 'Mettre à jour',
    'admin_clients_list.modal.create' => 'Créer',
];

$newKeysEn = [
    'admin_clients_list.app_layout_title' => 'Clients Management',
    'admin_clients_list.head_title' => 'Clients',
    'admin_clients_list.section_title' => 'Clients List',
    'admin_clients_list.add_button' => 'New Client',
    
    'admin_clients_list.table.full_name' => 'Full Name',
    'admin_clients_list.table.email' => 'Email',
    'admin_clients_list.table.phone' => 'Phone',
    'admin_clients_list.table.registration_date' => 'Registration Date',
    'admin_clients_list.table.actions' => 'Actions',
    
    'admin_clients_list.farm_account' => 'Farm Account',
    'admin_clients_list.empty' => 'No clients registered at the moment.',
    'admin_clients_list.delete_confirm' => 'Are you sure you want to archive this client? They will no longer have access to the platform.',
    
    'admin_clients_list.modal.add_title' => 'Add Client',
    'admin_clients_list.modal.edit_title' => 'Edit Client',
    'admin_clients_list.modal.first_name' => 'First Name',
    'admin_clients_list.modal.last_name' => 'Last Name',
    'admin_clients_list.modal.email' => 'Email',
    'admin_clients_list.modal.phone' => 'Phone',
    'admin_clients_list.modal.registration_date' => 'Registration Date',
    
    'admin_clients_list.modal.password_section' => 'Password',
    'admin_clients_list.modal.password_info' => 'Leave fields blank if you do not want to change the current password.',
    'admin_clients_list.modal.new_password' => 'New Password',
    'admin_clients_list.modal.password' => 'Password',
    'admin_clients_list.modal.confirm_password' => 'Confirm Password',
    
    'admin_clients_list.modal.cancel' => 'Cancel',
    'admin_clients_list.modal.update' => 'Update',
    'admin_clients_list.modal.create' => 'Create',
];

foreach ($files as $file) {
    $content = json_decode(file_get_contents($file), true);
    $lang = (strpos($file, 'fr.json') !== false) ? 'fr' : 'en';
    $keys = ($lang === 'fr') ? $newKeysFr : $newKeysEn;
    
    foreach ($keys as $dotKey => $value) {
        $parts = explode('.', $dotKey);
        $temp = &$content;
        foreach ($parts as $part) {
            if (!isset($temp[$part])) {
                $temp[$part] = [];
            }
            $temp = &$temp[$part];
        }
        $temp = $value;
        unset($temp);
    }
    
    file_put_contents($file, json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
echo "Translations updated.\n";
