import { useEffect, useState } from "react";
import Swal from "sweetalert2";


//alerte pour forcer la validation

export const ForcingValidation = Swal.mixin({
    title: 'Confirmation',
    text: 'Voullez-vous vraiment force la validation?',
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
})
const noNetWork = () => {


    Swal.fire({
        title: 'Probleme de connectivite',
        text: 'Veuillez verifier votre reseau',
        icon: 'error'
    })
}

export const problemOccur = () => {
    Swal.fire({
        title: 'Probleme inatttendu',
        text: 'Un probleme inattendu s\'est produit ou vous avez perdu la session',
        icon: 'error'
    })
}

export const Toast = Swal.mixin({
    icon: 'success',
    title: 'Operation réussie',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


export const ToastRemove = Swal.mixin({
    title: 'Confirmation',
    text: 'Voullez vous supprimer l\'element?',
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
})

export const ToastOperation = Swal.mixin({
    title: 'Confirmation',
    text: 'Voullez vous vraiment operer cette tache?',
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
})

export const ToastNotFound = Swal.mixin({
    icon: 'error',
    title: 'Ressource introuvable',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
export default noNetWork;