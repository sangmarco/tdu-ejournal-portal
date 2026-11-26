<?php
require __DIR__ . '/../publicPublications/Visibility.php';
use APP\plugins\generic\publicPublications\Visibility;
$n = 0;
function check(bool $value): void { global $n; $n++; if (!$value) throw new RuntimeException('Visibility assertion ' . $n); }
$c = ['path'=>'tapchi1','enabled'=>true,'pluginEnabled'=>true,'restricted'=>false,'mode'=>0];
check(Visibility::context($c));
check(Visibility::context(array_replace($c, ['mode'=>null])));
check(Visibility::context(array_replace($c, ['path'=>'tapchi2'])));
foreach (['garbage', '0', 0.5, false, 3, -1] as $mode) check(!Visibility::context(array_replace($c, ['mode'=>$mode])));
$missingMode = $c; unset($missingMode['mode']); check(!Visibility::context($missingMode));
check(!Visibility::context(array_replace($c, ['path'=>'tapchi2-extra'])));
foreach (['path'=>'other','enabled'=>false,'pluginEnabled'=>false,'restricted'=>true,'mode'=>2] as $k=>$v) check(!Visibility::context(array_replace($c, [$k=>$v])));
$i = ['id'=>1,'journalId'=>1,'published'=>true];
check(Visibility::issue($i, 1));
check(!Visibility::issue($i, 2));
check(!Visibility::issue(array_replace($i,['published'=>false]),1));
$s = ['id'=>1,'contextId'=>1,'status'=>3,'currentPublicationId'=>2];
$p = ['id'=>2,'submissionId'=>1,'status'=>3,'issueId'=>1,'sectionId'=>1];
$sec = ['id'=>1,'contextId'=>1];
check(Visibility::article($s,$p,$sec,1,1));
foreach (['contextId'=>2,'status'=>1,'currentPublicationId'=>3] as $k=>$v) check(!Visibility::article(array_replace($s,[$k=>$v]),$p,$sec,1,1));
foreach (['id'=>3,'submissionId'=>2,'status'=>1,'issueId'=>2,'sectionId'=>2] as $k=>$v) check(!Visibility::article($s,array_replace($p,[$k=>$v]),$sec,1,1));
check(!Visibility::article($s,$p,array_replace($sec,['contextId'=>2]),1,1));
echo "PASS $n synthetic visibility assertions; no live authorization claim\n";
