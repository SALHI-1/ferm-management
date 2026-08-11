<?php
$files = ['lang/en.json', 'lang/fr.json'];

$newKeysFr = [
    'ferme_bilan.table.month' => 'Mois',
    'ferme_bilan.table.costs_cas2' => 'Coûts (Investissement)',
    'ferme_bilan.table.milk_cas2' => 'Lait (Investissement)',
    'ferme_bilan.table.sales_cas2' => 'Ventes (Investissement)',
    'ferme_bilan.table.net_cas2' => 'Bénéfice Investissements',
    'ferme_bilan.table.net_cas1' => 'Bénéfice Commissions',
    'ferme_bilan.table.total' => 'Bénéfice Total de la Ferme'
];

$newKeysEn = [
    'ferme_bilan.table.month' => 'Month',
    'ferme_bilan.table.costs_cas2' => 'Costs (Investment)',
    'ferme_bilan.table.milk_cas2' => 'Milk (Investment)',
    'ferme_bilan.table.sales_cas2' => 'Sales (Investment)',
    'ferme_bilan.table.net_cas2' => 'Investment Profit',
    'ferme_bilan.table.net_cas1' => 'Commission Profit',
    'ferme_bilan.table.total' => 'Total Farm Profit'
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
echo "Bilan translations updated.\n";
