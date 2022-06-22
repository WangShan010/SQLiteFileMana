const path = require('path');
let list = [
    {ext: '.terrain', ContentType: 'application/octet-stream'},

    {ext: '.load', ContentType: 'text/html'},
    {ext: '.123', ContentType: 'application/vnd.lotus-1-2-3'},
    {ext: '.3ds', ContentType: 'image/x-3ds'},
    {ext: '.3g2', ContentType: 'video/3gpp'},
    {ext: '.3ga', ContentType: 'video/3gpp'},
    {ext: '.3gp', ContentType: 'video/3gpp'},
    {ext: '.3gpp', ContentType: 'video/3gpp'},
    {ext: '.602', ContentType: 'application/x-t602'},
    {ext: '.669', ContentType: 'audio/x-mod'},
    {ext: '.7z', ContentType: 'application/x-7z-compressed'},
    {ext: '.a', ContentType: 'application/x-archive'},
    {ext: '.aac', ContentType: 'audio/mp4'},
    {ext: '.abw', ContentType: 'application/x-abiword'},
    {ext: '.abw.crashed', ContentType: 'application/x-abiword'},
    {ext: '.abw.gz', ContentType: 'application/x-abiword'},
    {ext: '.ac3', ContentType: 'audio/ac3'},
    {ext: '.ace', ContentType: 'application/x-ace'},
    {ext: '.adb', ContentType: 'text/x-adasrc'},
    {ext: '.ads', ContentType: 'text/x-adasrc'},
    {ext: '.afm', ContentType: 'application/x-font-afm'},
    {ext: '.ag', ContentType: 'image/x-applix-graphics'},
    {ext: '.ai', ContentType: 'application/illustrator'},
    {ext: '.aif', ContentType: 'audio/x-aiff'},
    {ext: '.aifc', ContentType: 'audio/x-aiff'},
    {ext: '.aiff', ContentType: 'audio/x-aiff'},
    {ext: '.al', ContentType: 'application/x-perl'},
    {ext: '.alz', ContentType: 'application/x-alz'},
    {ext: '.amr', ContentType: 'audio/amr'},
    {ext: '.ani', ContentType: 'application/x-navi-animation'},
    {ext: '.anim[1-9j]', ContentType: 'video/x-anim'},
    {ext: '.anx', ContentType: 'application/annodex'},
    {ext: '.ape', ContentType: 'audio/x-ape'},
    {ext: '.arj', ContentType: 'application/x-arj'},
    {ext: '.arw', ContentType: 'image/x-sony-arw'},
    {ext: '.as', ContentType: 'application/x-applix-spreadsheet'},
    {ext: '.asc', ContentType: 'text/plain'},
    {ext: '.asf', ContentType: 'video/x-ms-asf'},
    {ext: '.asp', ContentType: 'application/x-asp'},
    {ext: '.ass', ContentType: 'text/x-ssa'},
    {ext: '.asx', ContentType: 'audio/x-ms-asx'},
    {ext: '.atom', ContentType: 'application/atom+xml'},
    {ext: '.au', ContentType: 'audio/basic'},
    {ext: '.avi', ContentType: 'video/x-msvideo'},
    {ext: '.aw', ContentType: 'application/x-applix-word'},
    {ext: '.awb', ContentType: 'audio/amr-wb'},
    {ext: '.awk', ContentType: 'application/x-awk'},
    {ext: '.axa', ContentType: 'audio/annodex'},
    {ext: '.axv', ContentType: 'video/annodex'},
    {ext: '.bak', ContentType: 'application/x-trash'},
    {ext: '.bcpio', ContentType: 'application/x-bcpio'},
    {ext: '.bdf', ContentType: 'application/x-font-bdf'},
    {ext: '.bib', ContentType: 'text/x-bibtex'},
    {ext: '.bin', ContentType: 'application/octet-stream'},
    {ext: '.blend', ContentType: 'application/x-blender'},
    {ext: '.blender', ContentType: 'application/x-blender'},
    {ext: '.bmp', ContentType: 'image/bmp'},
    {ext: '.bz', ContentType: 'application/x-bzip'},
    {ext: '.bz2', ContentType: 'application/x-bzip'},
    {ext: '.c', ContentType: 'text/x-csrc'},
    {ext: '.c++', ContentType: 'text/x-c++src'},
    {ext: '.cab', ContentType: 'application/vnd.ms-cab-compressed'},
    {ext: '.cb7', ContentType: 'application/x-cb7'},
    {ext: '.cbr', ContentType: 'application/x-cbr'},
    {ext: '.cbt', ContentType: 'application/x-cbt'},
    {ext: '.cbz', ContentType: 'application/x-cbz'},
    {ext: '.cc', ContentType: 'text/x-c++src'},
    {ext: '.cdf', ContentType: 'application/x-netcdf'},
    {ext: '.cdr', ContentType: 'application/vnd.corel-draw'},
    {ext: '.cer', ContentType: 'application/x-x509-ca-cert'},
    {ext: '.cert', ContentType: 'application/x-x509-ca-cert'},
    {ext: '.cgm', ContentType: 'image/cgm'},
    {ext: '.chm', ContentType: 'application/x-chm'},
    {ext: '.chrt', ContentType: 'application/x-kchart'},
    {ext: '.class', ContentType: 'application/x-java'},
    {ext: '.cls', ContentType: 'text/x-tex'},
    {ext: '.cmake', ContentType: 'text/x-cmake'},
    {ext: '.cpio', ContentType: 'application/x-cpio'},
    {ext: '.cpio.gz', ContentType: 'application/x-cpio-compressed'},
    {ext: '.cpp', ContentType: 'text/x-c++src'},
    {ext: '.cr2', ContentType: 'image/x-canon-cr2'},
    {ext: '.crt', ContentType: 'application/x-x509-ca-cert'},
    {ext: '.crw', ContentType: 'image/x-canon-crw'},
    {ext: '.cs', ContentType: 'text/x-csharp'},
    {ext: '.csh', ContentType: 'application/x-csh'},
    {ext: '.css', ContentType: 'text/css'},
    {ext: '.cssl', ContentType: 'text/css'},
    {ext: '.csv', ContentType: 'text/csv'},
    {ext: '.cue', ContentType: 'application/x-cue'},
    {ext: '.cur', ContentType: 'image/x-win-bitmap'},
    {ext: '.cxx', ContentType: 'text/x-c++src'},
    {ext: '.d', ContentType: 'text/x-dsrc'},
    {ext: '.dar', ContentType: 'application/x-dar'},
    {ext: '.dbf', ContentType: 'application/x-dbf'},
    {ext: '.dc', ContentType: 'application/x-dc-rom'},
    {ext: '.dcl', ContentType: 'text/x-dcl'},
    {ext: '.dcm', ContentType: 'application/dicom'},
    {ext: '.dcr', ContentType: 'image/x-kodak-dcr'},
    {ext: '.dds', ContentType: 'image/x-dds'},
    {ext: '.deb', ContentType: 'application/x-deb'},
    {ext: '.der', ContentType: 'application/x-x509-ca-cert'},
    {ext: '.desktop', ContentType: 'application/x-desktop'},
    {ext: '.dia', ContentType: 'application/x-dia-diagram'},
    {ext: '.diff', ContentType: 'text/x-patch'},
    {ext: '.divx', ContentType: 'video/x-msvideo'},
    {ext: '.djv', ContentType: 'image/vnd.djvu'},
    {ext: '.djvu', ContentType: 'image/vnd.djvu'},
    {ext: '.dng', ContentType: 'image/x-adobe-dng'},
    {ext: '.doc', ContentType: 'application/msword'},
    {ext: '.docbook', ContentType: 'application/docbook+xml'},
    {ext: '.docm', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
    {ext: '.docx', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
    {ext: '.dot', ContentType: 'text/vnd.graphviz'},
    {ext: '.dsl', ContentType: 'text/x-dsl'},
    {ext: '.dtd', ContentType: 'application/xml-dtd'},
    {ext: '.dtx', ContentType: 'text/x-tex'},
    {ext: '.dv', ContentType: 'video/dv'},
    {ext: '.dvi', ContentType: 'application/x-dvi'},
    {ext: '.dvi.bz2', ContentType: 'application/x-bzdvi'},
    {ext: '.dvi.gz', ContentType: 'application/x-gzdvi'},
    {ext: '.dwg', ContentType: 'image/vnd.dwg'},
    {ext: '.dxf', ContentType: 'image/vnd.dxf'},
    {ext: '.e', ContentType: 'text/x-eiffel'},
    {ext: '.egon', ContentType: 'application/x-egon'},
    {ext: '.eif', ContentType: 'text/x-eiffel'},
    {ext: '.el', ContentType: 'text/x-emacs-lisp'},
    {ext: '.emf', ContentType: 'image/x-emf'},
    {ext: '.emp', ContentType: 'application/vnd.emusic-emusic_package'},
    {ext: '.ent', ContentType: 'application/xml-external-parsed-entity'},
    {ext: '.eps', ContentType: 'image/x-eps'},
    {ext: '.eps.bz2', ContentType: 'image/x-bzeps'},
    {ext: '.eps.gz', ContentType: 'image/x-gzeps'},
    {ext: '.epsf', ContentType: 'image/x-eps'},
    {ext: '.epsf.bz2', ContentType: 'image/x-bzeps'},
    {ext: '.epsf.gz', ContentType: 'image/x-gzeps'},
    {ext: '.epsi', ContentType: 'image/x-eps'},
    {ext: '.epsi.bz2', ContentType: 'image/x-bzeps'},
    {ext: '.epsi.gz', ContentType: 'image/x-gzeps'},
    {ext: '.epub', ContentType: 'application/epub+zip'},
    {ext: '.erl', ContentType: 'text/x-erlang'},
    {ext: '.es', ContentType: 'application/ecmascript'},
    {ext: '.etheme', ContentType: 'application/x-e-theme'},
    {ext: '.etx', ContentType: 'text/x-setext'},
    {ext: '.exe', ContentType: 'application/x-ms-dos-executable'},
    {ext: '.exr', ContentType: 'image/x-exr'},
    {ext: '.ez', ContentType: 'application/andrew-inset'},
    {ext: '.f', ContentType: 'text/x-fortran'},
    {ext: '.f90', ContentType: 'text/x-fortran'},
    {ext: '.f95', ContentType: 'text/x-fortran'},
    {ext: '.fb2', ContentType: 'application/x-fictionbook+xml'},
    {ext: '.fig', ContentType: 'image/x-xfig'},
    {ext: '.fits', ContentType: 'image/fits'},
    {ext: '.fl', ContentType: 'application/x-fluid'},
    {ext: '.flac', ContentType: 'audio/x-flac'},
    {ext: '.flc', ContentType: 'video/x-flic'},
    {ext: '.fli', ContentType: 'video/x-flic'},
    {ext: '.flv', ContentType: 'video/x-flv'},
    {ext: '.flw', ContentType: 'application/x-kivio'},
    {ext: '.fo', ContentType: 'text/x-xslfo'},
    {ext: '.for', ContentType: 'text/x-fortran'},
    {ext: '.g3', ContentType: 'image/fax-g3'},
    {ext: '.gb', ContentType: 'application/x-gameboy-rom'},
    {ext: '.gba', ContentType: 'application/x-gba-rom'},
    {ext: '.gcrd', ContentType: 'text/directory'},
    {ext: '.ged', ContentType: 'application/x-gedcom'},
    {ext: '.gedcom', ContentType: 'application/x-gedcom'},
    {ext: '.gen', ContentType: 'application/x-genesis-rom'},
    {ext: '.gf', ContentType: 'application/x-tex-gf'},
    {ext: '.gg', ContentType: 'application/x-sms-rom'},
    {ext: '.gif', ContentType: 'image/gif'},
    {ext: '.glade', ContentType: 'application/x-glade'},
    {ext: '.gmo', ContentType: 'application/x-gettext-translation'},
    {ext: '.gnc', ContentType: 'application/x-gnucash'},
    {ext: '.gnd', ContentType: 'application/gnunet-directory'},
    {ext: '.gnucash', ContentType: 'application/x-gnucash'},
    {ext: '.gnumeric', ContentType: 'application/x-gnumeric'},
    {ext: '.gnuplot', ContentType: 'application/x-gnuplot'},
    {ext: '.gp', ContentType: 'application/x-gnuplot'},
    {ext: '.gpg', ContentType: 'application/pgp-encrypted'},
    {ext: '.gplt', ContentType: 'application/x-gnuplot'},
    {ext: '.gra', ContentType: 'application/x-graphite'},
    {ext: '.gsf', ContentType: 'application/x-font-type1'},
    {ext: '.gsm', ContentType: 'audio/x-gsm'},
    {ext: '.gtar', ContentType: 'application/x-tar'},
    {ext: '.gv', ContentType: 'text/vnd.graphviz'},
    {ext: '.gvp', ContentType: 'text/x-google-video-pointer'},
    {ext: '.gz', ContentType: 'application/x-gzip'},
    {ext: '.h', ContentType: 'text/x-chdr'},
    {ext: '.h++', ContentType: 'text/x-c++hdr'},
    {ext: '.hdf', ContentType: 'application/x-hdf'},
    {ext: '.hh', ContentType: 'text/x-c++hdr'},
    {ext: '.hp', ContentType: 'text/x-c++hdr'},
    {ext: '.hpgl', ContentType: 'application/vnd.hp-hpgl'},
    {ext: '.hpp', ContentType: 'text/x-c++hdr'},
    {ext: '.hs', ContentType: 'text/x-haskell'},
    {ext: '.htm', ContentType: 'text/html'},
    {ext: '.html', ContentType: 'text/html'},
    {ext: '.hwp', ContentType: 'application/x-hwp'},
    {ext: '.hwt', ContentType: 'application/x-hwt'},
    {ext: '.hxx', ContentType: 'text/x-c++hdr'},
    {ext: '.ica', ContentType: 'application/x-ica'},
    {ext: '.icb', ContentType: 'image/x-tga'},
    {ext: '.icns', ContentType: 'image/x-icns'},
    {ext: '.ico', ContentType: 'image/vnd.microsoft.icon'},
    {ext: '.ics', ContentType: 'text/calendar'},
    {ext: '.idl', ContentType: 'text/x-idl'},
    {ext: '.ief', ContentType: 'image/ief'},
    {ext: '.iff', ContentType: 'image/x-iff'},
    {ext: '.ilbm', ContentType: 'image/x-ilbm'},
    {ext: '.ime', ContentType: 'text/x-imelody'},
    {ext: '.imy', ContentType: 'text/x-imelody'},
    {ext: '.ins', ContentType: 'text/x-tex'},
    {ext: '.iptables', ContentType: 'text/x-iptables'},
    {ext: '.iso', ContentType: 'application/x-cd-image'},
    {ext: '.iso9660', ContentType: 'application/x-cd-image'},
    {ext: '.it', ContentType: 'audio/x-it'},
    {ext: '.j2k', ContentType: 'image/jp2'},
    {ext: '.jad', ContentType: 'text/vnd.sun.j2me.app-descriptor'},
    {ext: '.jar', ContentType: 'application/x-java-archive'},
    {ext: '.java', ContentType: 'text/x-java'},
    {ext: '.jng', ContentType: 'image/x-jng'},
    {ext: '.jnlp', ContentType: 'application/x-java-jnlp-file'},
    {ext: '.jp2', ContentType: 'image/jp2'},
    {ext: '.jpc', ContentType: 'image/jp2'},
    {ext: '.jpeg', ContentType: 'image/jpeg'},
    {ext: '.jpf', ContentType: 'image/jp2'},
    {ext: '.jpg', ContentType: 'image/jpeg'},
    {ext: '.jpr', ContentType: 'application/x-jbuilder-project'},
    {ext: '.jpx', ContentType: 'image/jp2'},
    {ext: '.js', ContentType: 'application/javascript'},
    {ext: '.json', ContentType: 'application/json'},
    {ext: '.jsonp', ContentType: 'application/jsonp'},
    {ext: '.k25', ContentType: 'image/x-kodak-k25'},
    {ext: '.kar', ContentType: 'audio/midi'},
    {ext: '.karbon', ContentType: 'application/x-karbon'},
    {ext: '.kdc', ContentType: 'image/x-kodak-kdc'},
    {ext: '.kdelnk', ContentType: 'application/x-desktop'},
    {ext: '.kexi', ContentType: 'application/x-kexiproject-sqlite3'},
    {ext: '.kexic', ContentType: 'application/x-kexi-connectiondata'},
    {ext: '.kexis', ContentType: 'application/x-kexiproject-shortcut'},
    {ext: '.kfo', ContentType: 'application/x-kformula'},
    {ext: '.kil', ContentType: 'application/x-killustrator'},
    {ext: '.kino', ContentType: 'application/smil'},
    {ext: '.kml', ContentType: 'application/vnd.google-earth.kml+xml'},
    {ext: '.kmz', ContentType: 'application/vnd.google-earth.kmz'},
    {ext: '.kon', ContentType: 'application/x-kontour'},
    {ext: '.kpm', ContentType: 'application/x-kpovmodeler'},
    {ext: '.kpr', ContentType: 'application/x-kpresenter'},
    {ext: '.kpt', ContentType: 'application/x-kpresenter'},
    {ext: '.kra', ContentType: 'application/x-krita'},
    {ext: '.ksp', ContentType: 'application/x-kspread'},
    {ext: '.kud', ContentType: 'application/x-kugar'},
    {ext: '.kwd', ContentType: 'application/x-kword'},
    {ext: '.kwt', ContentType: 'application/x-kword'},
    {ext: '.la', ContentType: 'application/x-shared-library-la'},
    {ext: '.latex', ContentType: 'text/x-tex'},
    {ext: '.ldif', ContentType: 'text/x-ldif'},
    {ext: '.lha', ContentType: 'application/x-lha'},
    {ext: '.lhs', ContentType: 'text/x-literate-haskell'},
    {ext: '.lhz', ContentType: 'application/x-lhz'},
    {ext: '.log', ContentType: 'text/x-log'},
    {ext: '.ltx', ContentType: 'text/x-tex'},
    {ext: '.lua', ContentType: 'text/x-lua'},
    {ext: '.lwo', ContentType: 'image/x-lwo'},
    {ext: '.lwob', ContentType: 'image/x-lwo'},
    {ext: '.lws', ContentType: 'image/x-lws'},
    {ext: '.ly', ContentType: 'text/x-lilypond'},
    {ext: '.lyx', ContentType: 'application/x-lyx'},
    {ext: '.lz', ContentType: 'application/x-lzip'},
    {ext: '.lzh', ContentType: 'application/x-lha'},
    {ext: '.lzma', ContentType: 'application/x-lzma'},
    {ext: '.lzo', ContentType: 'application/x-lzop'},
    {ext: '.m', ContentType: 'text/x-matlab'},
    {ext: '.m15', ContentType: 'audio/x-mod'},
    {ext: '.m2t', ContentType: 'video/mpeg'},
    {ext: '.m3u', ContentType: 'audio/x-mpegurl'},
    {ext: '.m3u8', ContentType: 'audio/x-mpegurl'},
    {ext: '.m4', ContentType: 'application/x-m4'},
    {ext: '.m4a', ContentType: 'audio/mp4'},
    {ext: '.m4b', ContentType: 'audio/x-m4b'},
    {ext: '.m4v', ContentType: 'video/mp4'},
    {ext: '.mab', ContentType: 'application/x-markaby'},
    {ext: '.man', ContentType: 'application/x-troff-man'},
    {ext: '.mbox', ContentType: 'application/mbox'},
    {ext: '.md', ContentType: 'application/x-genesis-rom'},
    {ext: '.mdb', ContentType: 'application/vnd.ms-access'},
    {ext: '.mdi', ContentType: 'image/vnd.ms-modi'},
    {ext: '.me', ContentType: 'text/x-troff-me'},
    {ext: '.med', ContentType: 'audio/x-mod'},
    {ext: '.metalink', ContentType: 'application/metalink+xml'},
    {ext: '.mgp', ContentType: 'application/x-magicpoint'},
    {ext: '.mid', ContentType: 'audio/midi'},
    {ext: '.midi', ContentType: 'audio/midi'},
    {ext: '.mif', ContentType: 'application/x-mif'},
    {ext: '.minipsf', ContentType: 'audio/x-minipsf'},
    {ext: '.mka', ContentType: 'audio/x-matroska'},
    {ext: '.mkv', ContentType: 'video/x-matroska'},
    {ext: '.ml', ContentType: 'text/x-ocaml'},
    {ext: '.mli', ContentType: 'text/x-ocaml'},
    {ext: '.mm', ContentType: 'text/x-troff-mm'},
    {ext: '.mmf', ContentType: 'application/x-smaf'},
    {ext: '.mml', ContentType: 'text/mathml'},
    {ext: '.mng', ContentType: 'video/x-mng'},
    {ext: '.mo', ContentType: 'application/x-gettext-translation'},
    {ext: '.mo3', ContentType: 'audio/x-mo3'},
    {ext: '.moc', ContentType: 'text/x-moc'},
    {ext: '.mod', ContentType: 'audio/x-mod'},
    {ext: '.mof', ContentType: 'text/x-mof'},
    {ext: '.moov', ContentType: 'video/quicktime'},
    {ext: '.mov', ContentType: 'video/quicktime'},
    {ext: '.movie', ContentType: 'video/x-sgi-movie'},
    {ext: '.mp+', ContentType: 'audio/x-musepack'},
    {ext: '.mp2', ContentType: 'video/mpeg'},
    {ext: '.mp3', ContentType: 'audio/mpeg'},
    {ext: '.mp4', ContentType: 'video/mp4'},
    {ext: '.mpc', ContentType: 'audio/x-musepack'},
    {ext: '.mpe', ContentType: 'video/mpeg'},
    {ext: '.mpeg', ContentType: 'video/mpeg'},
    {ext: '.mpg', ContentType: 'video/mpeg'},
    {ext: '.mpga', ContentType: 'audio/mpeg'},
    {ext: '.mpp', ContentType: 'audio/x-musepack'},
    {ext: '.mrl', ContentType: 'text/x-mrml'},
    {ext: '.mrml', ContentType: 'text/x-mrml'},
    {ext: '.mrw', ContentType: 'image/x-minolta-mrw'},
    {ext: '.ms', ContentType: 'text/x-troff-ms'},
    {ext: '.msi', ContentType: 'application/x-msi'},
    {ext: '.msod', ContentType: 'image/x-msod'},
    {ext: '.msx', ContentType: 'application/x-msx-rom'},
    {ext: '.mtm', ContentType: 'audio/x-mod'},
    {ext: '.mup', ContentType: 'text/x-mup'},
    {ext: '.mxf', ContentType: 'application/mxf'},
    {ext: '.n64', ContentType: 'application/x-n64-rom'},
    {ext: '.nb', ContentType: 'application/mathematica'},
    {ext: '.nc', ContentType: 'application/x-netcdf'},
    {ext: '.nds', ContentType: 'application/x-nintendo-ds-rom'},
    {ext: '.nef', ContentType: 'image/x-nikon-nef'},
    {ext: '.nes', ContentType: 'application/x-nes-rom'},
    {ext: '.nfo', ContentType: 'text/x-nfo'},
    {ext: '.not', ContentType: 'text/x-mup'},
    {ext: '.nsc', ContentType: 'application/x-netshow-channel'},
    {ext: '.nsv', ContentType: 'video/x-nsv'},
    {ext: '.o', ContentType: 'application/x-object'},
    {ext: '.obj', ContentType: 'application/x-tgif'},
    {ext: '.ocl', ContentType: 'text/x-ocl'},
    {ext: '.oda', ContentType: 'application/oda'},
    {ext: '.odb', ContentType: 'application/vnd.oasis.opendocument.database'},
    {ext: '.odc', ContentType: 'application/vnd.oasis.opendocument.chart'},
    {ext: '.odf', ContentType: 'application/vnd.oasis.opendocument.formula'},
    {ext: '.odg', ContentType: 'application/vnd.oasis.opendocument.graphics'},
    {ext: '.odi', ContentType: 'application/vnd.oasis.opendocument.image'},
    {ext: '.odm', ContentType: 'application/vnd.oasis.opendocument.text-master'},
    {ext: '.odp', ContentType: 'application/vnd.oasis.opendocument.presentation'},
    {ext: '.ods', ContentType: 'application/vnd.oasis.opendocument.spreadsheet'},
    {ext: '.odt', ContentType: 'application/vnd.oasis.opendocument.text'},
    {ext: '.oga', ContentType: 'audio/ogg'},
    {ext: '.ogg', ContentType: 'video/x-theora+ogg'},
    {ext: '.ogm', ContentType: 'video/x-ogm+ogg'},
    {ext: '.ogv', ContentType: 'video/ogg'},
    {ext: '.ogx', ContentType: 'application/ogg'},
    {ext: '.old', ContentType: 'application/x-trash'},
    {ext: '.oleo', ContentType: 'application/x-oleo'},
    {ext: '.opml', ContentType: 'text/x-opml+xml'},
    {ext: '.ora', ContentType: 'image/openraster'},
    {ext: '.orf', ContentType: 'image/x-olympus-orf'},
    {ext: '.otc', ContentType: 'application/vnd.oasis.opendocument.chart-template'},
    {ext: '.otf', ContentType: 'application/x-font-otf'},
    {ext: '.otg', ContentType: 'application/vnd.oasis.opendocument.graphics-template'},
    {ext: '.oth', ContentType: 'application/vnd.oasis.opendocument.text-web'},
    {ext: '.otp', ContentType: 'application/vnd.oasis.opendocument.presentation-template'},
    {ext: '.ots', ContentType: 'application/vnd.oasis.opendocument.spreadsheet-template'},
    {ext: '.ott', ContentType: 'application/vnd.oasis.opendocument.text-template'},
    {ext: '.owl', ContentType: 'application/rdf+xml'},
    {ext: '.oxt', ContentType: 'application/vnd.openofficeorg.extension'},
    {ext: '.p', ContentType: 'text/x-pascal'},
    {ext: '.p10', ContentType: 'application/pkcs10'},
    {ext: '.p12', ContentType: 'application/x-pkcs12'},
    {ext: '.p7b', ContentType: 'application/x-pkcs7-certificates'},
    {ext: '.p7s', ContentType: 'application/pkcs7-signature'},
    {ext: '.pack', ContentType: 'application/x-java-pack200'},
    {ext: '.pak', ContentType: 'application/x-pak'},
    {ext: '.par2', ContentType: 'application/x-par2'},
    {ext: '.pas', ContentType: 'text/x-pascal'},
    {ext: '.patch', ContentType: 'text/x-patch'},
    {ext: '.pbm', ContentType: 'image/x-portable-bitmap'},
    {ext: '.pcd', ContentType: 'image/x-photo-cd'},
    {ext: '.pcf', ContentType: 'application/x-cisco-vpn-settings'},
    {ext: '.pcf.gz', ContentType: 'application/x-font-pcf'},
    {ext: '.pcf.z', ContentType: 'application/x-font-pcf'},
    {ext: '.pcl', ContentType: 'application/vnd.hp-pcl'},
    {ext: '.pcx', ContentType: 'image/x-pcx'},
    {ext: '.pdb', ContentType: 'chemical/x-pdb'},
    {ext: '.pdc', ContentType: 'application/x-aportisdoc'},
    {ext: '.pdf', ContentType: 'application/pdf'},
    {ext: '.pdf.bz2', ContentType: 'application/x-bzpdf'},
    {ext: '.pdf.gz', ContentType: 'application/x-gzpdf'},
    {ext: '.pef', ContentType: 'image/x-pentax-pef'},
    {ext: '.pem', ContentType: 'application/x-x509-ca-cert'},
    {ext: '.perl', ContentType: 'application/x-perl'},
    {ext: '.pfa', ContentType: 'application/x-font-type1'},
    {ext: '.pfb', ContentType: 'application/x-font-type1'},
    {ext: '.pfx', ContentType: 'application/x-pkcs12'},
    {ext: '.pgm', ContentType: 'image/x-portable-graymap'},
    {ext: '.pgn', ContentType: 'application/x-chess-pgn'},
    {ext: '.pgp', ContentType: 'application/pgp-encrypted'},
    {ext: '.php', ContentType: 'application/x-php'},
    {ext: '.php3', ContentType: 'application/x-php'},
    {ext: '.php4', ContentType: 'application/x-php'},
    {ext: '.pict', ContentType: 'image/x-pict'},
    {ext: '.pict1', ContentType: 'image/x-pict'},
    {ext: '.pict2', ContentType: 'image/x-pict'},
    {ext: '.pickle', ContentType: 'application/python-pickle'},
    {ext: '.pk', ContentType: 'application/x-tex-pk'},
    {ext: '.pkipath', ContentType: 'application/pkix-pkipath'},
    {ext: '.pkr', ContentType: 'application/pgp-keys'},
    {ext: '.pl', ContentType: 'application/x-perl'},
    {ext: '.pla', ContentType: 'audio/x-iriver-pla'},
    {ext: '.pln', ContentType: 'application/x-planperfect'},
    {ext: '.pls', ContentType: 'audio/x-scpls'},
    {ext: '.pm', ContentType: 'application/x-perl'},
    {ext: '.png', ContentType: 'image/png'},
    {ext: '.pnm', ContentType: 'image/x-portable-anymap'},
    {ext: '.pntg', ContentType: 'image/x-macpaint'},
    {ext: '.po', ContentType: 'text/x-gettext-translation'},
    {ext: '.por', ContentType: 'application/x-spss-por'},
    {ext: '.pot', ContentType: 'text/x-gettext-translation-template'},
    {ext: '.ppm', ContentType: 'image/x-portable-pixmap'},
    {ext: '.pps', ContentType: 'application/vnd.ms-powerpoint'},
    {ext: '.ppt', ContentType: 'application/vnd.ms-powerpoint'},
    {ext: '.pptm', ContentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
    {ext: '.pptx', ContentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
    {ext: '.ppz', ContentType: 'application/vnd.ms-powerpoint'},
    {ext: '.prc', ContentType: 'application/x-palm-database'},
    {ext: '.ps', ContentType: 'application/postscript'},
    {ext: '.ps.bz2', ContentType: 'application/x-bzpostscript'},
    {ext: '.ps.gz', ContentType: 'application/x-gzpostscript'},
    {ext: '.psd', ContentType: 'image/vnd.adobe.photoshop'},
    {ext: '.psf', ContentType: 'audio/x-psf'},
    {ext: '.psf.gz', ContentType: 'application/x-gz-font-linux-psf'},
    {ext: '.psflib', ContentType: 'audio/x-psflib'},
    {ext: '.psid', ContentType: 'audio/prs.sid'},
    {ext: '.psw', ContentType: 'application/x-pocket-word'},
    {ext: '.pw', ContentType: 'application/x-pw'},
    {ext: '.py', ContentType: 'text/x-python'},
    {ext: '.pyc', ContentType: 'application/x-python-bytecode'},
    {ext: '.pyo', ContentType: 'application/x-python-bytecode'},
    {ext: '.qif', ContentType: 'image/x-quicktime'},
    {ext: '.qt', ContentType: 'video/quicktime'},
    {ext: '.qtif', ContentType: 'image/x-quicktime'},
    {ext: '.qtl', ContentType: 'application/x-quicktime-media-link'},
    {ext: '.qtvr', ContentType: 'video/quicktime'},
    {ext: '.ra', ContentType: 'audio/vnd.rn-realaudio'},
    {ext: '.raf', ContentType: 'image/x-fuji-raf'},
    {ext: '.ram', ContentType: 'application/ram'},
    {ext: '.rar', ContentType: 'application/x-rar'},
    {ext: '.ras', ContentType: 'image/x-cmu-raster'},
    {ext: '.raw', ContentType: 'image/x-panasonic-raw'},
    {ext: '.rax', ContentType: 'audio/vnd.rn-realaudio'},
    {ext: '.rb', ContentType: 'application/x-ruby'},
    {ext: '.rdf', ContentType: 'application/rdf+xml'},
    {ext: '.rdfs', ContentType: 'application/rdf+xml'},
    {ext: '.reg', ContentType: 'text/x-ms-regedit'},
    {ext: '.rej', ContentType: 'application/x-reject'},
    {ext: '.rgb', ContentType: 'image/x-rgb'},
    {ext: '.rle', ContentType: 'image/rle'},
    {ext: '.rm', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.rmj', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.rmm', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.rms', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.rmvb', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.rmx', ContentType: 'application/vnd.rn-realmedia'},
    {ext: '.roff', ContentType: 'text/troff'},
    {ext: '.rp', ContentType: 'image/vnd.rn-realpix'},
    {ext: '.rpm', ContentType: 'application/x-rpm'},
    {ext: '.rss', ContentType: 'application/rss+xml'},
    {ext: '.rt', ContentType: 'text/vnd.rn-realtext'},
    {ext: '.rtf', ContentType: 'application/rtf'},
    {ext: '.rtx', ContentType: 'text/richtext'},
    {ext: '.rv', ContentType: 'video/vnd.rn-realvideo'},
    {ext: '.rvx', ContentType: 'video/vnd.rn-realvideo'},
    {ext: '.s3m', ContentType: 'audio/x-s3m'},
    {ext: '.sam', ContentType: 'application/x-amipro'},
    {ext: '.sami', ContentType: 'application/x-sami'},
    {ext: '.sav', ContentType: 'application/x-spss-sav'},
    {ext: '.scm', ContentType: 'text/x-scheme'},
    {ext: '.sda', ContentType: 'application/vnd.stardivision.draw'},
    {ext: '.sdc', ContentType: 'application/vnd.stardivision.calc'},
    {ext: '.sdd', ContentType: 'application/vnd.stardivision.impress'},
    {ext: '.sdp', ContentType: 'application/sdp'},
    {ext: '.sds', ContentType: 'application/vnd.stardivision.chart'},
    {ext: '.sdw', ContentType: 'application/vnd.stardivision.writer'},
    {ext: '.sgf', ContentType: 'application/x-go-sgf'},
    {ext: '.sgi', ContentType: 'image/x-sgi'},
    {ext: '.sgl', ContentType: 'application/vnd.stardivision.writer'},
    {ext: '.sgm', ContentType: 'text/sgml'},
    {ext: '.sgml', ContentType: 'text/sgml'},
    {ext: '.sh', ContentType: 'application/x-shellscript'},
    {ext: '.shar', ContentType: 'application/x-shar'},
    {ext: '.shn', ContentType: 'application/x-shorten'},
    {ext: '.siag', ContentType: 'application/x-siag'},
    {ext: '.sid', ContentType: 'audio/prs.sid'},
    {ext: '.sik', ContentType: 'application/x-trash'},
    {ext: '.sis', ContentType: 'application/vnd.symbian.install'},
    {ext: '.sisx', ContentType: 'x-epoc/x-sisx-app'},
    {ext: '.sit', ContentType: 'application/x-stuffit'},
    {ext: '.siv', ContentType: 'application/sieve'},
    {ext: '.sk', ContentType: 'image/x-skencil'},
    {ext: '.sk1', ContentType: 'image/x-skencil'},
    {ext: '.skr', ContentType: 'application/pgp-keys'},
    {ext: '.slk', ContentType: 'text/spreadsheet'},
    {ext: '.smaf', ContentType: 'application/x-smaf'},
    {ext: '.smc', ContentType: 'application/x-snes-rom'},
    {ext: '.smd', ContentType: 'application/vnd.stardivision.mail'},
    {ext: '.smf', ContentType: 'application/vnd.stardivision.math'},
    {ext: '.smi', ContentType: 'application/x-sami'},
    {ext: '.smil', ContentType: 'application/smil'},
    {ext: '.sml', ContentType: 'application/smil'},
    {ext: '.sms', ContentType: 'application/x-sms-rom'},
    {ext: '.snd', ContentType: 'audio/basic'},
    {ext: '.so', ContentType: 'application/x-sharedlib'},
    {ext: '.spc', ContentType: 'application/x-pkcs7-certificates'},
    {ext: '.spd', ContentType: 'application/x-font-speedo'},
    {ext: '.spec', ContentType: 'text/x-rpm-spec'},
    {ext: '.spl', ContentType: 'application/x-shockwave-flash'},
    {ext: '.spx', ContentType: 'audio/x-speex'},
    {ext: '.sql', ContentType: 'text/x-sql'},
    {ext: '.sr2', ContentType: 'image/x-sony-sr2'},
    {ext: '.src', ContentType: 'application/x-wais-source'},
    {ext: '.srf', ContentType: 'image/x-sony-srf'},
    {ext: '.srt', ContentType: 'application/x-subrip'},
    {ext: '.ssa', ContentType: 'text/x-ssa'},
    {ext: '.stc', ContentType: 'application/vnd.sun.xml.calc.template'},
    {ext: '.std', ContentType: 'application/vnd.sun.xml.draw.template'},
    {ext: '.sti', ContentType: 'application/vnd.sun.xml.impress.template'},
    {ext: '.stm', ContentType: 'audio/x-stm'},
    {ext: '.stw', ContentType: 'application/vnd.sun.xml.writer.template'},
    {ext: '.sty', ContentType: 'text/x-tex'},
    {ext: '.sub', ContentType: 'text/x-subviewer'},
    {ext: '.sun', ContentType: 'image/x-sun-raster'},
    {ext: '.sv4cpio', ContentType: 'application/x-sv4cpio'},
    {ext: '.sv4crc', ContentType: 'application/x-sv4crc'},
    {ext: '.svg', ContentType: 'image/svg+xml'},
    {ext: '.svgz', ContentType: 'image/svg+xml-compressed'},
    {ext: '.swf', ContentType: 'application/x-shockwave-flash'},
    {ext: '.sxc', ContentType: 'application/vnd.sun.xml.calc'},
    {ext: '.sxd', ContentType: 'application/vnd.sun.xml.draw'},
    {ext: '.sxg', ContentType: 'application/vnd.sun.xml.writer.global'},
    {ext: '.sxi', ContentType: 'application/vnd.sun.xml.impress'},
    {ext: '.sxm', ContentType: 'application/vnd.sun.xml.math'},
    {ext: '.sxw', ContentType: 'application/vnd.sun.xml.writer'},
    {ext: '.sylk', ContentType: 'text/spreadsheet'},
    {ext: '.t', ContentType: 'text/troff'},
    {ext: '.t2t', ContentType: 'text/x-txt2tags'},
    {ext: '.tar', ContentType: 'application/x-tar'},
    {ext: '.tar.bz', ContentType: 'application/x-bzip-compressed-tar'},
    {ext: '.tar.bz2', ContentType: 'application/x-bzip-compressed-tar'},
    {ext: '.tar.gz', ContentType: 'application/x-compressed-tar'},
    {ext: '.tar.lzma', ContentType: 'application/x-lzma-compressed-tar'},
    {ext: '.tar.lzo', ContentType: 'application/x-tzo'},
    {ext: '.tar.xz', ContentType: 'application/x-xz-compressed-tar'},
    {ext: '.tar.z', ContentType: 'application/x-tarz'},
    {ext: '.tbz', ContentType: 'application/x-bzip-compressed-tar'},
    {ext: '.tbz2', ContentType: 'application/x-bzip-compressed-tar'},
    {ext: '.tcl', ContentType: 'text/x-tcl'},
    {ext: '.tex', ContentType: 'text/x-tex'},
    {ext: '.texi', ContentType: 'text/x-texinfo'},
    {ext: '.texinfo', ContentType: 'text/x-texinfo'},
    {ext: '.tga', ContentType: 'image/x-tga'},
    {ext: '.tgz', ContentType: 'application/x-compressed-tar'},
    {ext: '.theme', ContentType: 'application/x-theme'},
    {ext: '.themepack', ContentType: 'application/x-windows-themepack'},
    {ext: '.tif', ContentType: 'image/tiff'},
    {ext: '.tiff', ContentType: 'image/tiff'},
    {ext: '.tk', ContentType: 'text/x-tcl'},
    {ext: '.tlz', ContentType: 'application/x-lzma-compressed-tar'},
    {ext: '.tnef', ContentType: 'application/vnd.ms-tnef'},
    {ext: '.tnf', ContentType: 'application/vnd.ms-tnef'},
    {ext: '.toc', ContentType: 'application/x-cdrdao-toc'},
    {ext: '.torrent', ContentType: 'application/x-bittorrent'},
    {ext: '.tpic', ContentType: 'image/x-tga'},
    {ext: '.tr', ContentType: 'text/troff'},
    {ext: '.ts', ContentType: 'application/x-linguist'},
    {ext: '.tsv', ContentType: 'text/tab-separated-values'},
    {ext: '.tta', ContentType: 'audio/x-tta'},
    {ext: '.ttc', ContentType: 'application/x-font-ttf'},
    {ext: '.ttf', ContentType: 'application/x-font-ttf'},
    {ext: '.ttx', ContentType: 'application/x-font-ttx'},
    {ext: '.txt', ContentType: 'text/plain'},
    {ext: '.txz', ContentType: 'application/x-xz-compressed-tar'},
    {ext: '.tzo', ContentType: 'application/x-tzo'},
    {ext: '.ufraw', ContentType: 'application/x-ufraw'},
    {ext: '.ui', ContentType: 'application/x-designer'},
    {ext: '.uil', ContentType: 'text/x-uil'},
    {ext: '.ult', ContentType: 'audio/x-mod'},
    {ext: '.uni', ContentType: 'audio/x-mod'},
    {ext: '.uri', ContentType: 'text/x-uri'},
    {ext: '.url', ContentType: 'text/x-uri'},
    {ext: '.ustar', ContentType: 'application/x-ustar'},
    {ext: '.vala', ContentType: 'text/x-vala'},
    {ext: '.vapi', ContentType: 'text/x-vala'},
    {ext: '.vcf', ContentType: 'text/directory'},
    {ext: '.vcs', ContentType: 'text/calendar'},
    {ext: '.vct', ContentType: 'text/directory'},
    {ext: '.vda', ContentType: 'image/x-tga'},
    {ext: '.vhd', ContentType: 'text/x-vhdl'},
    {ext: '.vhdl', ContentType: 'text/x-vhdl'},
    {ext: '.viv', ContentType: 'video/vivo'},
    {ext: '.vivo', ContentType: 'video/vivo'},
    {ext: '.vlc', ContentType: 'audio/x-mpegurl'},
    {ext: '.vob', ContentType: 'video/mpeg'},
    {ext: '.voc', ContentType: 'audio/x-voc'},
    {ext: '.vor', ContentType: 'application/vnd.stardivision.writer'},
    {ext: '.vst', ContentType: 'image/x-tga'},
    {ext: '.wav', ContentType: 'audio/x-wav'},
    {ext: '.wax', ContentType: 'audio/x-ms-asx'},
    {ext: '.wb1', ContentType: 'application/x-quattropro'},
    {ext: '.wb2', ContentType: 'application/x-quattropro'},
    {ext: '.wb3', ContentType: 'application/x-quattropro'},
    {ext: '.wbmp', ContentType: 'image/vnd.wap.wbmp'},
    {ext: '.wcm', ContentType: 'application/vnd.ms-works'},
    {ext: '.wdb', ContentType: 'application/vnd.ms-works'},
    {ext: '.webm', ContentType: 'video/webm'},
    {ext: '.wk1', ContentType: 'application/vnd.lotus-1-2-3'},
    {ext: '.wk3', ContentType: 'application/vnd.lotus-1-2-3'},
    {ext: '.wk4', ContentType: 'application/vnd.lotus-1-2-3'},
    {ext: '.wks', ContentType: 'application/vnd.ms-works'},
    {ext: '.wma', ContentType: 'audio/x-ms-wma'},
    {ext: '.wmf', ContentType: 'image/x-wmf'},
    {ext: '.wml', ContentType: 'text/vnd.wap.wml'},
    {ext: '.wmls', ContentType: 'text/vnd.wap.wmlscript'},
    {ext: '.wmv', ContentType: 'video/x-ms-wmv'},
    {ext: '.wmx', ContentType: 'audio/x-ms-asx'},
    {ext: '.wp', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wp4', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wp5', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wp6', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wpd', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wpg', ContentType: 'application/x-wpg'},
    {ext: '.wpl', ContentType: 'application/vnd.ms-wpl'},
    {ext: '.wpp', ContentType: 'application/vnd.wordperfect'},
    {ext: '.wps', ContentType: 'application/vnd.ms-works'},
    {ext: '.wri', ContentType: 'application/x-mswrite'},
    {ext: '.wrl', ContentType: 'model/vrml'},
    {ext: '.wv', ContentType: 'audio/x-wavpack'},
    {ext: '.wvc', ContentType: 'audio/x-wavpack-correction'},
    {ext: '.wvp', ContentType: 'audio/x-wavpack'},
    {ext: '.wvx', ContentType: 'audio/x-ms-asx'},
    {ext: '.x3f', ContentType: 'image/x-sigma-x3f'},
    {ext: '.xac', ContentType: 'application/x-gnucash'},
    {ext: '.xbel', ContentType: 'application/x-xbel'},
    {ext: '.xbl', ContentType: 'application/xml'},
    {ext: '.xbm', ContentType: 'image/x-xbitmap'},
    {ext: '.xcf', ContentType: 'image/x-xcf'},
    {ext: '.xcf.bz2', ContentType: 'image/x-compressed-xcf'},
    {ext: '.xcf.gz', ContentType: 'image/x-compressed-xcf'},
    {ext: '.xhtml', ContentType: 'application/xhtml+xml'},
    {ext: '.xi', ContentType: 'audio/x-xi'},
    {ext: '.xla', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xlc', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xld', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xlf', ContentType: 'application/x-xliff'},
    {ext: '.xliff', ContentType: 'application/x-xliff'},
    {ext: '.xll', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xlm', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xls', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xlsm', ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
    {ext: '.xlsx', ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
    {ext: '.xlt', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xlw', ContentType: 'application/vnd.ms-excel'},
    {ext: '.xm', ContentType: 'audio/x-xm'},
    {ext: '.xmf', ContentType: 'audio/x-xmf'},
    {ext: '.xmi', ContentType: 'text/x-xmi'},
    {ext: '.xml', ContentType: 'application/xml'},
    {ext: '.xpm', ContentType: 'image/x-xpixmap'},
    {ext: '.xps', ContentType: 'application/vnd.ms-xpsdocument'},
    {ext: '.xsl', ContentType: 'application/xml'},
    {ext: '.xslfo', ContentType: 'text/x-xslfo'},
    {ext: '.xslt', ContentType: 'application/xml'},
    {ext: '.xspf', ContentType: 'application/xspf+xml'},
    {ext: '.xul', ContentType: 'application/vnd.mozilla.xul+xml'},
    {ext: '.xwd', ContentType: 'image/x-xwindowdump'},
    {ext: '.xyz', ContentType: 'chemical/x-pdb'},
    {ext: '.xz', ContentType: 'application/x-xz'},
    {ext: '.w2p', ContentType: 'application/w2p'},
    {ext: '.z', ContentType: 'application/x-compress'},
    {ext: '.zabw', ContentType: 'application/x-abiword'},
    {ext: '.zip', ContentType: 'application/zip'}
];

const ContentTypeTool = {
    getContentType(fileName) {
        let extName = path.extname(fileName).toLowerCase();
        let resType = list.find(item => item.ext === extName);

        return resType ? resType.ContentType : 'application/octet-stream';
    },
    getExt(contentType) {
        return list.find(item => contentType.indexOf(item.ContentType) > -1).ext;
    }

};


module.exports = ContentTypeTool;