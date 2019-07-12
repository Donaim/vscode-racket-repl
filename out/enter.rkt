; Using "racket -e ..." has a namespace issue,
; see https://www.mail-archive.com/racket-users@googlegroups.com/msg39219.html
; This is a workaround that uses "racket -f ..." instead as proposed here:
; https://www.mail-archive.com/racket-users@googlegroups.com/msg39209.html
(define args (current-command-line-arguments))
(define dirname (vector-ref args 0))
(define filename (vector-ref args 1))
(current-directory (build-path dirname))
(current-load-relative-directory (build-path dirname))
(dynamic-enter! (build-path dirname filename))
